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
    meta: { titleSuffix: '- Adi Indotent' },
    components: {
      // The Payload mark on the login screen and in the nav, swapped for the
      // company's. Both live in src/components/admin/graphics.tsx.
      graphics: {
        Logo: '/components/admin/graphics#Logo',
        Icon: '/components/admin/graphics#Icon',
      },
      // Payload's sidebar has no way back to the dashboard except the logo.
      beforeNavLinks: ['/components/admin/dashboard-nav-link#DashboardNavLink'],
      // Theme and reset preferences, in the gear menu above the logout button.
      settingsMenu: ['/components/admin/nav-settings#NavSettings'],
    },
    /*
     * Dashboard widgets, in place of the bare grid of collection cards.
     *
     * Every number these render is queried from this database — there are no
     * placeholder trends or sample figures. Widgets an editor does not want can
     * be removed from the dashboard in the UI; `defaultLayout` is only the
     * starting arrangement.
     *
     * Payload's own `collections` card grid is left out of the layout: it
     * repeated the sidebar, which now carries the same links with icons. It is
     * still appended to `widgets` by Payload, so it can be added back from the
     * dashboard's own edit mode without a config change.
     */
    dashboard: {
      widgets: [
        {
          slug: 'at-a-glance',
          label: 'At a glance',
          Component: '/components/admin/widgets/at-a-glance#AtAGlance',
          minWidth: 'full',
        },
        {
          slug: 'events-by-category',
          label: 'Events by category',
          Component: '/components/admin/widgets/events-by-category#EventsByCategory',
        },
        {
          slug: 'category-pages',
          label: 'Category pages',
          Component: '/components/admin/widgets/category-pages#CategoryPages',
        },
        {
          slug: 'recent-activity',
          label: 'Recently edited',
          Component: '/components/admin/widgets/recent-activity#RecentActivity',
        },
      ],
      defaultLayout: [
        { widgetSlug: 'at-a-glance', width: 'full' },
        { widgetSlug: 'events-by-category', width: 'medium' },
        { widgetSlug: 'category-pages', width: 'medium' },
        { widgetSlug: 'recent-activity', width: 'full' },
      ],
    },
  },
  /*
   * Nav order within each `admin.group`. Content first and in the order an
   * editor is most likely to want it; Users sits alone under Settings.
   */
  collections: [Products, Events, Media, Users],
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
