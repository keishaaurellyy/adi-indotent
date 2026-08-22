/**
 * Seeds the content transcribed from the Figma design. Run it with:
 *
 *   npm run seed
 *
 * Meant for an empty database. It refuses to run once content exists, because
 * its idempotency is keyed on a unique field: an editor renaming an event means
 * the seed no longer recognises it and creates a second copy. To override:
 *
 *   npm run seed:force
 *
 * That passes a positional `force` argument rather than a --flag, because the
 * Payload CLI parses argv with minimist and rebuilds process.argv from the
 * positional arguments only — any --flag is dropped before the script sees it.
 *
 * Even then nothing is overwritten — entries that already match on their key
 * field are skipped, and globals that already carry a title are left alone.
 *
 * Top-level await is required — `payload run` only awaits module evaluation.
 */
import config from '@payload-config';
import { getPayload, type CollectionSlug, type GlobalSlug, type Payload } from 'payload';

import { events, peralatanPendukung, products, roder, sarnafil } from '../src/seed-data';

type SeedEntry = Record<string, unknown>;

const COLLECTIONS = ['products', 'events'] as const satisfies readonly CollectionSlug[];
const GLOBALS = ['roder', 'sarnafil', 'peralatan-pendukung'] as const satisfies readonly GlobalSlug[];

/** Human-readable list of whatever content is already in the database. */
const findExistingContent = async (payload: Payload): Promise<string[]> => {
  const found: string[] = [];

  for (const collection of COLLECTIONS) {
    const { totalDocs } = await payload.count({ collection });
    if (totalDocs > 0) found.push(`${collection}: ${totalDocs} dokumen`);
  }

  for (const slug of GLOBALS) {
    const doc = await payload.findGlobal({ slug });
    if (doc && typeof doc.title === 'string' && doc.title.length > 0) {
      found.push(`${slug}: sudah terisi`);
    }
  }

  return found;
};

/** Create each entry unless one already matches on `keyField`. */
const seedCollection = async (
  payload: Payload,
  collection: CollectionSlug,
  entries: SeedEntry[],
  keyField: string
) => {
  let created = 0;

  for (const entry of entries) {
    const { totalDocs } = await payload.count({
      collection,
      where: { [keyField]: { equals: entry[keyField] } },
    });

    if (totalDocs === 0) {
      await payload.create({
        collection,
        data: { ...entry, _status: 'published' } as never,
      });
      created += 1;
    }
  }

  console.log(`  ${collection.padEnd(20)} ${created} dibuat, ${entries.length - created} dilewati`);
};

/**
 * Globals always resolve to a document, so "does it exist" is answered by
 * whether it carries content yet rather than by its absence.
 */
const seedGlobal = async (payload: Payload, slug: GlobalSlug, data: SeedEntry) => {
  const existing = await payload.findGlobal({ slug });

  if (existing && typeof existing.title === 'string' && existing.title.length > 0) {
    console.log(`  ${slug.padEnd(20)} dilewati (sudah terisi)`);
    return;
  }

  await payload.updateGlobal({
    slug,
    data: { ...data, _status: 'published' } as never,
  });
  console.log(`  ${slug.padEnd(20)} diisi`);
};

try {
  const force = process.argv.slice(2).includes('force') || Boolean(process.env.SEED_FORCE);
  const payload = await getPayload({ config });

  const existing = await findExistingContent(payload);

  if (existing.length > 0 && !force) {
    console.error(
      [
        '',
        'DIBATALKAN: database sudah berisi konten.',
        '',
        ...existing.map((line) => `  - ${line}`),
        '',
        'Seed hanya untuk database kosong. Menjalankannya di atas konten yang',
        'sudah diedit bisa membuat data ganda — mis. event yang namanya sudah',
        'diubah tidak lagi dikenali, lalu dibuat ulang.',
        '',
        'Kalau memang disengaja: npm run seed:force',
        '',
      ].join('\n')
    );
    process.exit(1);
  }

  if (force && existing.length > 0) {
    console.log('\nMode force: melanjutkan walau database sudah berisi konten.');
  }

  console.log('\nCollections');
  await seedCollection(payload, 'products', products, 'category_key');
  await seedCollection(payload, 'events', events, 'name');

  console.log('\nGlobals');
  await seedGlobal(payload, 'roder', roder);
  await seedGlobal(payload, 'sarnafil', sarnafil);
  await seedGlobal(payload, 'peralatan-pendukung', peralatanPendukung);

  console.log('\nSelesai.\n');
  process.exit(0);
} catch (error) {
  console.error('\nGAGAL:', error instanceof Error ? error.message : error, '\n');
  process.exit(1);
}
