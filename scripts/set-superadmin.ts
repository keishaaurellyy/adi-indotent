/**
 * Hands the superadmin role to an existing account. Run it with:
 *
 *   npm run superadmin -- someone@example.com
 *
 * There is exactly one superadmin: the only person who can open Settings >
 * Users, and therefore the only person who can add, remove or re-role anyone
 * else. Everyone else is a plain admin with the full run of the content.
 *
 * The panel deliberately refuses to promote a second superadmin, demote the
 * only one, or delete them — otherwise one wrong dropdown would leave the site
 * with nobody who can manage accounts. This script is the way past those
 * guards, which is why it is a terminal command and not a button: whoever runs
 * it already has the database and the server.
 *
 * It also backfills. Accounts that predate the role field have no role at all;
 * they already behave as plain admins everywhere, and this writes that down so
 * the panel shows it.
 *
 * The email is a positional argument, or SUPERADMIN_EMAIL. Positional because
 * the Payload CLI parses argv with minimist and drops any --flag before the
 * script sees it.
 *
 * Top-level await is required — `payload run` only awaits module evaluation.
 */
import config from '@payload-config';
import { getPayload } from 'payload';

const email = (process.argv.slice(2)[0] ?? process.env.SUPERADMIN_EMAIL ?? '')
  .trim()
  .toLowerCase();

try {
  if (!email) {
    throw new Error('Which account? Run: npm run superadmin -- someone@example.com');
  }

  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
  });
  const target = docs[0];

  if (!target) {
    throw new Error(`No account with the email ${email}. Create it first: npm run create-admin`);
  }

  const { docs: missingRole } = await payload.find({
    collection: 'users',
    where: { role: { exists: false } },
    limit: 200,
    depth: 0,
  });

  const { docs: superadmins } = await payload.find({
    collection: 'users',
    where: { role: { equals: 'superadmin' } },
    limit: 200,
    depth: 0,
  });

  const backfill = missingRole.filter((user) => user.id !== target.id);
  const demote = superadmins.filter((user) => user.id !== target.id);

  /*
   * `payload.db.updateOne` rather than `payload.update`: the collection's
   * hooks exist to stop precisely these writes, and going through them would
   * mean the script could never move the role at all.
   */
  for (const user of [...backfill, ...demote]) {
    await payload.db.updateOne({
      collection: 'users',
      id: user.id,
      data: { role: 'admin' },
    });
  }

  if (target.role === 'superadmin' && !backfill.length && !demote.length) {
    console.log(`\n${email} is already the superadmin — nothing changed.\n`);
    process.exit(0);
  }

  await payload.db.updateOne({
    collection: 'users',
    id: target.id,
    data: { role: 'superadmin' },
  });

  const lines = ['', `${email} is now the superadmin.`];
  if (demote.length) {
    lines.push(`Demoted to admin: ${demote.map((user) => user.email).join(', ')}`);
  }
  if (backfill.length) {
    lines.push(`Filled in the missing role on ${backfill.length} other account(s).`);
  }
  lines.push('');
  console.log(lines.join('\n'));

  process.exit(0);
} catch (error) {
  console.error('\nFAILED:', error instanceof Error ? error.message : error, '\n');
  process.exit(1);
}
