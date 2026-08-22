import type { GlobalConfig } from 'payload';

import { trimMedia } from '../hooks/trimMedia';

import { categoryHeaderFields } from '../fields/sections';

export const PeralatanPendukung: GlobalConfig = {
  slug: 'peralatan-pendukung',
  label: 'Kategori: Peralatan Pendukung',
  access: { read: () => true },
  versions: { drafts: true },
  hooks: { afterRead: [trimMedia] },
  fields: [
    ...categoryHeaderFields,
    {
      name: 'equipment_groups',
      label: 'Equipment Groups',
      type: 'array',
      admin: { description: 'Grup peralatan, mis. Dekorasi & Ruangan, Kursi & Meja.' },
      fields: [
        { name: 'group_name', type: 'text', required: true },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'image', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
};
