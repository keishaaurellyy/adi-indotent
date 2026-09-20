import type { GlobalConfig } from 'payload';
import { hideDocTabs } from '../lib/admin-views';

import { trimMedia } from '../hooks/trimMedia';

import {
  categoryHeaderFields,
  faqSection,
  flooringSection,
  sizeVariantSection,
  specSection,
  textSection,
  usecaseSection,
} from '../fields/sections';

export const Sarnafil: GlobalConfig = {
  slug: 'sarnafil',
  label: 'Sarnafil',
  admin: {
    hideAPIURL: true,
    components: hideDocTabs,
    group: 'Category Pages',
    description: 'Everything on /products/sarnafil, top to bottom.',
  },
  access: { read: () => true },
  versions: { drafts: true },
  hooks: { afterRead: [trimMedia] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        { label: 'Page Header', fields: categoryHeaderFields },
        {
          // Same order as `sarnafilBlocks` in src/lib/categories.ts — Roder's
          // list minus Jenis Roder and Pilihan Dinding.
          label: 'Sections',
          fields: [
            usecaseSection(),
            sizeVariantSection(),
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
