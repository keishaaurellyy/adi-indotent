import type { CollectionConfig, GlobalSlug } from "payload";

import { trimMedia } from "../hooks/trimMedia";

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Product", plural: "Products" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category_key", "display_order"],
    description:
      "Data utama kategori produk: tampil di Products Overview (home) & submenu navbar.",
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
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea" },
    {
      name: "hero_image",
      type: "upload",
      relationTo: "media",
      virtual: true,
      admin: {
        readOnly: true,
        description:
          "Diambil otomatis dari hero_image milik global kategori ini.",
      },
    },
    {
      name: "category_key",
      type: "select",
      required: true,
      unique: true,
      options: ["roder", "sarnafil", "peralatan-pendukung"],
      admin: {
        description:
          "Menentukan halaman detail mana yang dibuka kartu ini, sekaligus global mana yang dipakai untuk gambarnya.",
      },
    },
    { name: "display_order", type: "number", defaultValue: 0 },
  ],
};
