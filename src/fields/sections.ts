import type { Field } from 'payload';

/**
 * Shows the row's own text as its title when an array row is collapsed.
 *
 * Resolved against `admin.importMap.baseDir`, which payload.config.ts sets to
 * `src`.
 */
const ROW_LABEL = '/components/admin/row-label#RowLabel';

type SectionArgs = {
  name: string;
  label: string;
  /** Where this section shows up on the page, in the editor's words. */
  description: string;
  /** Names one row, e.g. "Use Case" — Payload prints it on the Add button. */
  itemLabels: { singular: string; plural: string };
  itemFields: Field[];
  extraFields?: Field[];
  /**
   * Start rows collapsed. Right for rows carrying a paragraph, where an open
   * row is tall and a list of them is unscrollable; wrong for rows that are
   * mostly a thumbnail, where collapsing hides the only thing worth seeing.
   */
  collapseRows?: boolean;
  /**
   * Rows made of nothing but an image have no text to title them, so they keep
   * Payload's numbered default ("Photo 01") instead.
   */
  rowLabel?: boolean;
};

const groupNameField: Field = {
  name: 'group_name',
  label: 'Section heading',
  type: 'text',
  required: true,
  admin: { description: 'The heading printed above this section on the page.' },
};

/**
 * One section of a category page.
 *
 * The collapsible is presentation only — it keeps a page like Roder, which has
 * eight of these, readable as a list of headings instead of one endless form.
 * The group inside it is what actually shapes the data (`use_cases.group_name`,
 * `use_cases.items`), so its own label is switched off to avoid printing the
 * section name twice.
 */
export const section = ({
  name,
  label,
  description,
  itemLabels,
  itemFields,
  extraFields = [],
  collapseRows = false,
  rowLabel = true,
}: SectionArgs): Field => ({
  type: 'collapsible',
  label,
  admin: { initCollapsed: true, description },
  fields: [
    {
      name,
      type: 'group',
      label: false,
      admin: { hideGutter: true },
      fields: [
        groupNameField,
        ...extraFields,
        {
          name: 'items',
          // `labels` names one row, which Payload prints on the Add button and
          // nowhere else; the field's own label is what sits above the list,
          // and left to itself it would read "Items" on all eight sections.
          label: itemLabels.plural,
          labels: itemLabels,
          type: 'array',
          admin: {
            initCollapsed: collapseRows,
            ...(rowLabel ? { components: { RowLabel: ROW_LABEL } } : {}),
          },
          fields: itemFields,
        },
      ],
    },
  ],
});

const imageField: Field = {
  name: 'image',
  label: 'Image',
  type: 'upload',
  relationTo: 'media',
};

export const usecaseSection = (name = 'use_cases'): Field =>
  section({
    name,
    label: 'Use Cases',
    description: 'What the tent is typically used for. Text only — no images in this section.',
    itemLabels: { singular: 'Use Case', plural: 'Use Cases' },
    collapseRows: true,
    itemFields: [
      { name: 'name', label: 'Use case', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  });

export const nameImageSection = (name: string, label: string): Field =>
  section({
    name,
    label,
    description: 'A grid of photos, each with a caption underneath.',
    itemLabels: { singular: 'Option', plural: 'Options' },
    itemFields: [{ name: 'name', label: 'Caption', type: 'text', required: true }, imageField],
  });

export const itemSection = (name: string, label: string): Field =>
  section({
    name,
    label,
    description: 'Photos with a name and a paragraph of description each.',
    itemLabels: { singular: 'Option', plural: 'Options' },
    collapseRows: true,
    itemFields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      imageField,
    ],
  });

export const sizeVariantSection = (name = 'size_variants'): Field =>
  section({
    name,
    label: 'Size Variants',
    description:
      'The sizes on offer, as a grid of drawings or photos with the size as the caption.',
    itemLabels: { singular: 'Size', plural: 'Sizes' },
    itemFields: [
      {
        name: 'name',
        label: 'Size',
        type: 'text',
        required: true,
        admin: { description: 'e.g. "10 x 20 m".' },
      },
      imageField,
    ],
  });

export const textSection = (name = 'yang_anda_dapatkan'): Field =>
  section({
    name,
    label: 'What You Get',
    description: 'A plain list of what is included. One point per row.',
    itemLabels: { singular: 'Point', plural: 'Points' },
    collapseRows: true,
    itemFields: [{ name: 'description', label: 'Point', type: 'textarea', required: true }],
  });

export const flooringSection = (name = 'flooring_modul'): Field =>
  section({
    name,
    label: 'Flooring Modul',
    description:
      'An intro paragraph and a photo gallery. The paragraph shows on its own even while the gallery is still empty.',
    itemLabels: { singular: 'Photo', plural: 'Photos' },
    rowLabel: false,
    extraFields: [
      {
        name: 'description',
        label: 'Intro paragraph',
        type: 'textarea',
        admin: { description: 'Explains what flooring modul is, above the photos.' },
      },
    ],
    itemFields: [imageField],
  });

export const specSection = (name = 'specifications'): Field =>
  section({
    name,
    label: 'Specifications',
    description: 'The spec table. Each row is one line of the table.',
    itemLabels: { singular: 'Spec', plural: 'Specs' },
    collapseRows: true,
    itemFields: [
      {
        name: 'label',
        label: 'Spec',
        type: 'text',
        required: true,
        admin: { description: 'Left column, e.g. "Material atap".' },
      },
      {
        name: 'value',
        label: 'Value',
        type: 'textarea',
        admin: { description: 'Right column.' },
      },
    ],
  });

export const faqSection = (name = 'pertanyaan_umum'): Field =>
  section({
    name,
    label: 'FAQ',
    description: 'The accordion at the bottom of the page. Each row is one question.',
    itemLabels: { singular: 'Question', plural: 'Questions' },
    collapseRows: true,
    itemFields: [
      { name: 'question', label: 'Question', type: 'text', required: true },
      { name: 'answer', label: 'Answer', type: 'textarea' },
    ],
  });

/** Title, intro and hero image — the top of every category page. */
export const categoryHeaderFields: Field[] = [
  {
    name: 'title',
    label: 'Page title',
    type: 'text',
    required: true,
    admin: { description: 'The big heading at the top of the page.' },
  },
  {
    name: 'description',
    label: 'Intro',
    type: 'textarea',
    admin: { description: 'The paragraph under the heading.' },
  },
  {
    name: 'hero_image',
    label: 'Hero image',
    type: 'upload',
    relationTo: 'media',
    admin: {
      description:
        'The banner at the top of the page. This is also the image on the product card on the home page.',
    },
  },
];
