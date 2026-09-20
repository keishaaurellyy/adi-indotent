/**
 * Gives the superadmin role to an existing account. Run it with:
 *
 *   npm run superadmin -- someone@example.com
 *
 * Superadmins are the only people who can open Settings > Users, and therefore
 * the only people who can add, remove or re-role anyone else. Everyone else is
 * a plain admin with the full run of the content.
 *
 * There can be more than one, and day to day a superadmin promotes the next one
 * from the panel — this script is the way in when nobody is there to do that:
 * the first superadmin after a restore, or the replacement for one who was
 * removed straight from the database. It writes through the database layer
 * rather than the Local API for the same reason, so it still works when the
 * collection's own guards or validation would get in the way. That is also why
 * it is a terminal command and not a button: whoever runs it already has the
 * database and the server.
 *
 * Nobody is demoted. The panel refuses only to leave the site with zero
 * superadmins; handing the role over means promoting the new one here and
 * demoting the old one from Settings > Users.
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

  const backfill = missingRole.filter((user) => user.id !== target.id);

  for (const user of backfill) {
    await payload.db.updateOne({
      collection: 'users',
      id: user.id,
      data: { role: 'admin' },
    });
  }

  if (target.role === 'superadmin' && !backfill.length) {
    console.log(`\n${email} is already a superadmin — nothing changed.\n`);
    process.exit(0);
  }

  await payload.db.updateOne({
    collection: 'users',
    id: target.id,
    data: { role: 'superadmin' },
  });

  const { totalDocs: superadmins } = await payload.count({
    collection: 'users',
    where: { role: { equals: 'superadmin' } },
  });

  const lines = ['', `${email} is now a superadmin.`];
  if (superadmins > 1) {
    lines.push(`The site has ${superadmins} superadmins. Manage the rest in Settings > Users.`);
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
