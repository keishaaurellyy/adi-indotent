import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'File', plural: 'Media Library' },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'Content',
    description:
      'Every image, video and PDF used on the site. Upload here once and pick the file from a product, event or category page.',
  },
  access: { read: () => true },
  /**
   * Trim what comes back when a media doc is populated from somewhere else —
   * a product card only needs to render the image, not filesize, dimensions,
   * focal point and every generated size.
   *
   * This applies to populated relations only. Reading /api/media directly
   * still returns everything, which the admin Media Library depends on.
   */
  defaultPopulate: { alt: true, filename: true, url: true },
  upload: {
    mimeTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 320 },
      { name: 'small', width: 768 },
      { name: 'medium', width: 1280 },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      admin: {
        description:
          'A short description of what is in the image, for screen readers and search engines. Describe the subject, not the file — "Tenda Sarnafil di halaman kantor", not "foto 1".',
      },
    },
  ],
};
