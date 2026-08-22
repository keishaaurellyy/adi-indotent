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
  label: 'Kategori: Roder',
  access: { read: () => true },
  versions: { drafts: true },
  hooks: { afterRead: [trimMedia] },
  fields: [
    ...categoryHeaderFields,
    usecaseSection(),
    nameImageSection('jenis_roder', 'Jenis Roder'),
    itemSection('pilihan_dinding', 'Pilihan Dinding'),
    sizeVariantSection(),
    textSection(),
    flooringSection(),
    specSection(),
    faqSection(),
  ],
};
