import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
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
      type: 'text',
      admin: { description: 'Deskripsi singkat gambar untuk pembaca layar dan SEO.' },
    },
  ],
};
