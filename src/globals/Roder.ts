import type { GlobalConfig } from 'payload';

import { trimMedia } from '../hooks/trimMedia';

import {
  categoryHeaderFields,
  faqSection,
  flooringSection,
  itemSection,
  nameImageSection,
  sizeVariantSection,
  specSection,
  textSection,
  usecaseSection,
} from '../fields/sections';

export const Roder: GlobalConfig = {
  slug: 'roder',
  label: 'Roder',
  admin: {
    group: 'Category Pages',
    description: 'Everything on /products/roder, top to bottom.',
  },
  access: { read: () => true },
  versions: { drafts: true },
  hooks: { afterRead: [trimMedia] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          // Unnamed tabs: labels only, no `name`. They lay the form out
          // without nesting the data, so `roder.title` stays `roder.title`
          // and src/lib/categories.ts reads exactly what it read before.
          label: 'Page Header',
          fields: categoryHeaderFields,
        },
        {
          /*
           * In the order the page renders them — see `roderBlocks` in
           * src/lib/categories.ts. That function, not this list, decides what
           * the page shows; keeping the two in step is what lets an editor
           * work down the form and down the page at the same time.
           */
          label: 'Sections',
          fields: [
            usecaseSection(),
            sizeVariantSection(),
            nameImageSection('jenis_roder', 'Jenis Roder'),
            itemSection('pilihan_dinding', 'Pilihan Dinding'),
            specSection(),
            textSection(),
            flooringSection(),
            faqSection(),
          ],
        },
      ],
    },
  ],
};
