import type { GlobalConfig } from 'payload';
import { hideDocTabs } from '../lib/admin-views';

import { trimMedia } from '../hooks/trimMedia';

import { categoryHeaderFields } from '../fields/sections';

export const PeralatanPendukung: GlobalConfig = {
  slug: 'peralatan-pendukung',
  label: 'Peralatan Pendukung',
  admin: {
    hideAPIURL: true,
    components: hideDocTabs,
    group: 'Category Pages',
    description: 'Everything on /products/peralatan-pendukung, top to bottom.',
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
          label: 'Equipment',
          fields: [
            {
              /*
               * The one section that nests twice: groups, each holding its own
               * items. It is also the only section this page has, so unlike
               * Roder and Sarnafil there is nothing to collapse it against —
               * it stays open.
               */
              name: 'equipment_groups',
              label: 'Equipment Groups',
              labels: { singular: 'Group', plural: 'Groups' },
              type: 'array',
              admin: {
                description:
                  'One group per kind of equipment, e.g. Dekorasi & Ruangan, Kursi & Meja. Each group prints its own heading on the page, so there is no heading above them.',
                initCollapsed: true,
                components: { RowLabel: '/components/admin/row-label#RowLabel' },
              },
              fields: [
                {
                  name: 'group_name',
                  label: 'Group name',
                  type: 'text',
                  required: true,
                  admin: { description: 'The heading printed above this group on the page.' },
                },
                {
                  name: 'items',
                  label: 'Equipment',
                  labels: { singular: 'Item', plural: 'Items' },
                  type: 'array',
                  admin: {
                    description: 'A photo and a name for each piece of equipment in this group.',
                    components: { RowLabel: '/components/admin/row-label#RowLabel' },
                  },
                  fields: [
                    { name: 'name', label: 'Name', type: 'text', required: true },
                    { name: 'image', label: 'Image', type: 'upload', relationTo: 'media' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
