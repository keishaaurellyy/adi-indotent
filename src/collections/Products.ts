import type { CollectionConfig, GlobalSlug } from "payload";

import { trimMedia } from "../hooks/trimMedia";

/*
 * These values are the category slugs the site routes on — /products/roder and
 * so on — and they pick which global supplies the card's image. They are a
 * TypeScript union in src/lib/categories.ts, so a value cannot be changed here
 * alone. The labels are the names the site shows.
 */
const CATEGORY_KEYS = [
  { value: "roder", label: "Roder" },
  { value: "sarnafil", label: "Sarnafil" },
  { value: "peralatan-pendukung", label: "Peralatan Pendukung" },
];

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Product Card", plural: "Product Cards" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category_key", "display_order"],
    group: "Content",
    description:
      "The three cards in Products on the home page, and the entries in the navbar's Products menu. Each card links to a category page — edit the page itself under Category Pages.",
  },
  access: { read: () => true },
  versions: { drafts: true },
  defaultSort: "display_order",
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        const slug = doc?.category_key as GlobalSlug | undefined;
        if (!slug) return doc;

        const cache = (req.context.categoryHeroImages ??= {}) as Record<
          string,
          unknown
        >;

        if (!(slug in cache)) {
          const global = await req.payload.findGlobal({ slug, depth: 1, req });
          cache[slug] =
            (global as { hero_image?: unknown })?.hero_image ?? null;
        }

        doc.hero_image = cache[slug];
        return doc;
      },
      trimMedia,
    ],
  },
  fields: [
    {
      name: "title",
      label: "Card title",
      type: "text",
      required: true,
      admin: { description: "The product name as it reads on the card." },
    },
    {
      name: "description",
      label: "Card description",
      type: "textarea",
      admin: { description: "One or two sentences under the title." },
    },
    {
      type: "row",
      fields: [
        {
          name: "category_key",
          label: "Links to",
          type: "select",
          required: true,
          unique: true,
          options: CATEGORY_KEYS,
          admin: {
            width: "50%",
            description:
              "Which category page this card opens — and which page's hero image it borrows. One card per category.",
          },
        },
        {
          name: "display_order",
          label: "Order",
          type: "number",
          defaultValue: 0,
          admin: { width: "50%", description: "Lowest number shows first." },
        },
      ],
    },
    {
      name: "hero_image",
      label: "Card image",
      type: "upload",
      relationTo: "media",
      virtual: true,
      admin: {
        readOnly: true,
        description:
          "Read-only. This is the hero image from the category page above — change it there and this card follows.",
      },
    },
  ],
};
