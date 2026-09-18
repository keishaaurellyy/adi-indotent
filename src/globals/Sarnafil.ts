import type { GlobalConfig } from 'payload';

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
  label: 'Kategori: Sarnafil',
  access: { read: () => true },
  versions: { drafts: true },
  hooks: { afterRead: [trimMedia] },
  fields: [
    ...categoryHeaderFields,
    usecaseSection(),
    sizeVariantSection(),
    textSection(),
    flooringSection(),
    specSection(),
    faqSection(),
  ],
};
