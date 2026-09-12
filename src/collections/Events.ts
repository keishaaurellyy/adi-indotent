import type { CollectionConfig } from 'payload';

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'event_category', 'is_featured', 'display_order'],
  },
  access: { read: () => true },
  versions: { drafts: true },
  defaultSort: 'display_order',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'event_category',
      type: 'select',
      options: [
        'korporat',
        'pemerintahan',
        'keagamaan',
        'festival',
        'bazaar',
        'wedding',
        'komunitas',
      ],
    },
    { name: 'location', type: 'text' },
    { name: 'duration', type: 'text' },
    { name: 'is_featured', type: 'checkbox', defaultValue: false },
    { name: 'display_order', type: 'number', defaultValue: 0 },
  ],
};
