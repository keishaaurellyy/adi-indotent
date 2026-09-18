import type { Field } from 'payload';

type SectionArgs = {
  name: string;
  label: string;
  itemFields: Field[];
  extraFields?: Field[];
};

const groupNameField: Field = {
  name: 'group_name',
  type: 'text',
  required: true,
  admin: { description: 'Judul yang tampil di atas section ini.' },
};

export const section = ({ name, label, itemFields, extraFields = [] }: SectionArgs): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    groupNameField,
    ...extraFields,
    {
      name: 'items',
      type: 'array',
      fields: itemFields,
    },
  ],
});

const imageField: Field = {
  name: 'image',
  type: 'upload',
  relationTo: 'media',
};

export const usecaseSection = (name = 'use_cases'): Field =>
  section({
    name,
    label: 'Use Cases',
    itemFields: [
      { name: 'name', type: 'text', required: true },
      { name: 'description', type: 'textarea' },
    ],
  });

export const nameImageSection = (name: string, label: string): Field =>
  section({
    name,
    label,
    itemFields: [{ name: 'name', type: 'text', required: true }, imageField],
  });

export const itemSection = (name: string, label: string): Field =>
  section({
    name,
    label,
    itemFields: [
      { name: 'name', type: 'text', required: true },
      { name: 'description', type: 'textarea' },
      imageField,
    ],
  });

export const sizeVariantSection = (name = 'size_variants'): Field =>
  section({
    name,
    label: 'Size Variants',
    itemFields: [{ name: 'name', type: 'text', required: true }, imageField],
  });

export const textSection = (name = 'yang_anda_dapatkan'): Field =>
  section({
    name,
    label: 'Yang Anda Dapatkan',
    itemFields: [{ name: 'description', type: 'textarea', required: true }],
  });

export const flooringSection = (name = 'flooring_modul'): Field =>
  section({
    name,
    label: 'Flooring Modul',
    extraFields: [{ name: 'description', type: 'textarea' }],
    itemFields: [imageField],
  });

export const specSection = (name = 'specifications'): Field =>
  section({
    name,
    label: 'Specifications',
    itemFields: [
      { name: 'label', type: 'text', required: true },
      { name: 'value', type: 'textarea' },
    ],
  });

export const faqSection = (name = 'pertanyaan_umum'): Field =>
  section({
    name,
    label: 'Pertanyaan Umum',
    itemFields: [
      { name: 'question', type: 'text', required: true },
      { name: 'answer', type: 'textarea' },
    ],
  });

export const categoryHeaderFields: Field[] = [
  { name: 'title', type: 'text', required: true },
  { name: 'description', type: 'textarea' },
  { name: 'hero_image', type: 'upload', relationTo: 'media' },
];
