import path from 'path';
import { fileURLToPath } from 'url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { Events } from './collections/Events';
import { Media } from './collections/Media';
import { Products } from './collections/Products';
import { Users } from './collections/Users';
import { PeralatanPendukung } from './globals/PeralatanPendukung';
import { Roder } from './globals/Roder';
import { Sarnafil } from './globals/Sarnafil';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const publicBucketUrl = process.env.R2_PUBLIC_URL;

const hasR2Credentials = Boolean(
  process.env.R2_BUCKET &&
    process.env.R2_ENDPOINT &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY
);

const storage = s3Storage({
  enabled: hasR2Credentials,
  collections: {
    media: publicBucketUrl
      ? {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            [publicBucketUrl.replace(/\/$/, ''), prefix, filename].filter(Boolean).join('/'),
        }
      : true,
  },
  bucket: process.env.R2_BUCKET ?? '',
  config: {
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
    },
  },
});

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: '— Adi Indotent' },
  },
  collections: [Users, Media, Products, Events],
  globals: [Roder, Sarnafil, PeralatanPendukung],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI ?? '' },
  }),
  secret: process.env.PAYLOAD_SECRET ?? '',
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  plugins: [storage],
});
