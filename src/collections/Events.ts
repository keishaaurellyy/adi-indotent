import type { CollectionConfig } from 'payload';

/*
 * The stored values are the enum slugs the frontend maps to display chips in
 * src/lib/events.ts — changing one here without changing it there drops the
 * chip. The labels are the Indonesian words the site itself shows, so what an
 * editor picks in the admin reads the same as what lands on the page.
 */
const EVENT_CATEGORIES = [
  { value: 'korporat', label: 'Korporat' },
  { value: 'pemerintahan', label: 'Pemerintahan' },
  { value: 'keagamaan', label: 'Keagamaan' },
  { value: 'festival', label: 'Festival' },
  { value: 'bazaar', label: 'Bazaar' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'komunitas', label: 'Komunitas' },
];

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'event_category', 'location', 'display_order'],
    group: 'Content',
    description:
      'Past events, shown on the home page and on /events. Only published events appear on the site — a draft stays private until you hit Publish.',
    listSearchableFields: ['name', 'location'],
  },
  access: { read: () => true },
  versions: { drafts: true },
  defaultSort: 'display_order',
  fields: [
    {
      name: 'name',
      label: 'Event name',
      type: 'text',
      required: true,
      admin: { description: 'The heading on the card, e.g. "Gathering Telkom Indonesia".' },
    },
    {
      name: 'image',
      label: 'Photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'One photo from the event. Landscape crops best on the card.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'event_category',
          label: 'Category',
          type: 'select',
          options: EVENT_CATEGORIES,
          admin: {
            width: '50%',
            description: 'Shown as a chip on the card. Leave empty to show no chip.',
          },
        },
        {
          name: 'location',
          label: 'Location',
          type: 'text',
          admin: { width: '50%', description: 'Where it was held, e.g. "Jakarta Convention Center".' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'duration',
          label: 'Duration',
          type: 'text',
          admin: { width: '50%', description: 'How long it ran, e.g. "3 hari".' },
        },
        {
          name: 'display_order',
          label: 'Order',
          type: 'number',
          defaultValue: 0,
          admin: {
            width: '50%',
            description: 'Lowest number first. Events sharing a number fall back to when they were added.',
          },
        },
      ],
    },
    {
      name: 'is_featured',
      label: 'Featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        // The seed sets this on the first three events but nothing reads it —
        // neither getHomeEvents nor the /events index filters or sorts on it.
        // Said plainly here so nobody ticks it expecting the site to react.
        description:
          'Not used by the site yet. Ticking it changes nothing on the page — use Order to control what shows first.',
      },
    },
  ],
};
