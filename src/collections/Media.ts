import type { CollectionConfig } from 'payload';
import { hideDocTabs } from '../lib/admin-views';

/**
 * Keeps a field out of the list's Columns picker and Filters. Payload adds the
 * upload fields itself and offers every one of them by default, including the
 * generated URLs and each image size's URL, width, height and so on.
 */
const hiddenFromList = { disableListColumn: true, disableListFilter: true, disableGroupBy: true };

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'File', plural: 'Media Library' },
  admin: {
    hideAPIURL: true,
    components: hideDocTabs,
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
      { name: 'thumbnail', width: 320, admin: hiddenFromList },
      { name: 'small', width: 768, admin: hiddenFromList },
      { name: 'medium', width: 1280, admin: hiddenFromList },
    ],
  },
  fields: [
    // Redeclared only to set `admin`. Payload merges these over its own upload
    // fields, so their type, hooks and behaviour stay as they were.
    { name: 'url', type: 'text', admin: hiddenFromList },
    { name: 'thumbnailURL', type: 'text', admin: hiddenFromList },
    {
      name: 'filesize',
      type: 'number',
      admin: { components: { Cell: '/components/admin/file-size-cell#FileSizeCell' } },
    },
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
