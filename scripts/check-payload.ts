import config from '@payload-config';
import { getPayload } from 'payload';

const collections = ['users', 'media', 'products', 'events'] as const;
const globals = ['roder', 'sarnafil', 'peralatan-pendukung'] as const;

try {
  const payload = await getPayload({ config });

  const lines: string[] = ['', 'Collections'];
  for (const collection of collections) {
    const { totalDocs } = await payload.count({ collection });
    lines.push(`  ${collection.padEnd(20)} ${totalDocs} doc(s)`);
  }

  lines.push('', 'Globals');
  for (const slug of globals) {
    const doc = await payload.findGlobal({ slug });
    const title = typeof doc?.title === 'string' && doc.title ? doc.title : '(kosong)';
    lines.push(`  ${slug.padEnd(20)} ${title}`);
  }

  lines.push('', 'OK — Local API reachable.', '');
  console.log(lines.join('\n'));
  process.exit(0);
} catch (error) {
  console.error('\nFAILED:', error instanceof Error ? error.message : error, '\n');
  process.exit(1);
}
