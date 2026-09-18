/**
 * Creates an admin user for the Payload panel at /admin. Run it with:
 *
 *   npm run create-admin
 *
 * Prompts for the email and password, masking the password as you type, so
 * neither ends up in your shell history. To run it unattended — CI, a
 * container entrypoint — set ADMIN_EMAIL and ADMIN_PASSWORD instead and it
 * skips the prompts.
 *
 * Existing accounts are never touched. If the email is already registered the
 * script says so and exits, because silently resetting someone else's
 * password is not what "create" should do. To reset one deliberately:
 *
 *   npm run create-admin -- reset
 *
 * That takes a positional argument rather than a --flag: the Payload CLI
 * parses argv with minimist and rebuilds process.argv from the positional
 * arguments only, so any --flag is dropped before the script sees it.
 *
 * Top-level await is required — `payload run` only awaits module evaluation.
 */
import config from '@payload-config';
import { createInterface } from 'node:readline/promises';
import { getPayload } from 'payload';

/** Payload itself allows very short passwords; this is our own floor. */
const MIN_PASSWORD_LENGTH = 8;

const reset = process.argv.slice(2).includes('reset');

/**
 * Reads a line without echoing it. Raw mode is what suppresses the echo, so
 * every exit path has to restore cooked mode or the terminal is left unusable
 * after the script ends.
 */
function promptHidden(question: string): Promise<string> {
  const { stdin, stdout } = process;

  if (!stdin.isTTY) {
    return Promise.reject(
      new Error('Not a terminal — set ADMIN_PASSWORD instead of being prompted.')
    );
  }

  return new Promise((resolve) => {
    let value = '';
    stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    const restore = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.off('data', onData);
    };

    const onData = (chunk: string) => {
      for (const char of chunk) {
        switch (char) {
          case '\r':
          case '\n':
            restore();
            stdout.write('\n');
            resolve(value);
            return;
          // Ctrl-C: raw mode swallows SIGINT, so quit by hand.
          case '\u0003':
            restore();
            stdout.write('\n');
            process.exit(130);
            return;
          case '\u007f':
          case '\b':
            value = value.slice(0, -1);
            break;
          default:
            value += char;
        }
      }
    };

    stdin.on('data', onData);
  });
}

async function readCredentials() {
  const envEmail = process.env.ADMIN_EMAIL?.trim();
  const envPassword = process.env.ADMIN_PASSWORD;

  if (envEmail && envPassword) {
    return { email: envEmail, password: envPassword, name: process.env.ADMIN_NAME?.trim() };
  }

  // Without a terminal there is nothing to prompt: readline's question()
  // never resolves on a closed stdin, so the process would drain the event
  // loop and exit 0 having done nothing at all.
  if (!process.stdin.isTTY) {
    throw new Error(
      'Not a terminal — set both ADMIN_EMAIL and ADMIN_PASSWORD to run unattended.'
    );
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const email = envEmail ?? (await rl.question('Email: ')).trim();
    const name = process.env.ADMIN_NAME?.trim() ?? (await rl.question('Name (optional): ')).trim();
    // Close before switching stdin to raw mode; readline and the raw-mode
    // listener both consume stdin and would race for the keystrokes.
    rl.close();

    if (envPassword) return { email, password: envPassword, name };

    const password = await promptHidden('Password: ');
    const confirm = await promptHidden('Confirm password: ');
    if (password !== confirm) throw new Error('Passwords do not match.');

    return { email, password, name };
  } finally {
    rl.close();
  }
}

try {
  const { email, password, name } = await readCredentials();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new Error(`"${email}" does not look like an email address.`);
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  });
  const existing = docs[0];

  if (existing && !reset) {
    console.log(
      `\n${email} already exists — nothing changed.` +
        '\nTo reset its password: npm run create-admin -- reset\n'
    );
    process.exit(0);
  }

  if (existing) {
    await payload.update({ collection: 'users', id: existing.id, data: { password } });
    console.log(`\nPassword reset for ${email}. Sign in at /admin.\n`);
  } else {
    await payload.create({ collection: 'users', data: { email, password, ...(name && { name }) } });
    console.log(`\nCreated ${email}. Sign in at /admin.\n`);
  }

  process.exit(0);
} catch (error) {
  console.error('\nFAILED:', error instanceof Error ? error.message : error, '\n');
  process.exit(1);
}
