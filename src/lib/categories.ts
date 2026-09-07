// Server-only by construction: importing `payload` or the config from a
// client component fails the build, so no "server-only" guard is needed.
import config from "@payload-config";
import { getPayload } from "payload";
import type {
  Media,
  PeralatanPendukung,
  Product,
  Roder,
  Sarnafil,
} from "@/payload-types";

/**
 * The category slugs, borrowed from the Products collection's `category_key`
 * select so the two cannot drift. Adding an option there widens this union,
 * which breaks the switch in `getCategory` until a global and a normaliser
 * exist for it.
 */
export type CategorySlug = Product["category_key"];

/**
 * Every slug the route prerenders, in navigation order.
 *
 * The switch in `getCategory` is what proves this list is complete — TypeScript
 * requires a branch per member of the union, so a category cannot be added to
 * the CMS and silently skipped here.
 */
export const CATEGORY_SLUGS: readonly CategorySlug[] = [
  "roder",
  "sarnafil",
  "peralatan-pendukung",
];

export function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(value);
}

/** A media relation flattened to what next/image needs. */
export type MediaRef = { url: string; alt: string };

/**
 * One rendered section, tagged by the *item shape* it holds rather than by
 * the field it came from. Two fields with the same shape — `jenis_roder` and
 * `size_variants` are both name-plus-image — share one renderer, which is why
 * `kind` describes the shape and `id` records the origin.
 */
type BlockBase = { id: string; title: string };

export type SectionBlock =
  | (BlockBase & {
      kind: "useCase";
      items: { id: string; name: string; description: string | null }[];
    })
  | (BlockBase & {
      kind: "nameImage";
      items: { id: string; name: string; image: MediaRef | null }[];
    })
  | (BlockBase & {
      kind: "detail";
      items: {
        id: string;
        name: string;
        description: string | null;
        image: MediaRef | null;
      }[];
    })
  | (BlockBase & {
      kind: "text";
      items: { id: string; description: string }[];
    })
  | (BlockBase & {
      kind: "gallery";
      description: string | null;
      items: { id: string; image: MediaRef }[];
    })
  | (BlockBase & {
      kind: "spec";
      items: { id: string; label: string; value: string | null }[];
    })
  | (BlockBase & {
      kind: "faq";
      items: { id: string; question: string; answer: string | null }[];
    })
  | (BlockBase & {
      kind: "equipment";
      groups: {
        id: string;
        name: string;
        items: { id: string; name: string; image: MediaRef | null }[];
      }[];
    });

/**
 * Raw section shapes, aliased off Roder because it is the superset — it holds
 * every section the other two use. Sarnafil's identically-shaped fields are
 * structurally assignable, so one alias serves both.
 */
type RawUseCase = Roder["use_cases"];
type RawNameImage = Roder["size_variants"];
type RawDetail = Roder["pilihan_dinding"];
type RawText = Roder["yang_anda_dapatkan"];
type RawGallery = Roder["flooring_modul"];
type RawSpec = Roder["specifications"];
type RawFaq = Roder["pertanyaan_umum"];

function media(value: (number | null) | Media | undefined): MediaRef | null {
  // An unpopulated relation arrives as an id; `trimMedia` reduces a populated
  // one to { id, url, alt } for public reads.
  if (typeof value !== "object" || value === null) return null;
  return value.url ? { url: value.url, alt: value.alt ?? "" } : null;
}

/**
 * Payload gives array rows a random string id, but only once they have been
 * saved through the admin — the index is the fallback so `key` is never
 * undefined on freshly seeded content.
 */
function rowId(row: { id?: string | null }, index: number): string {
  return row.id ?? String(index);
}

/*
 * One builder per item shape. Each returns null for an empty section: the CMS
 * ships sections whose items nobody has filled in yet — `flooring_modul` is
 * empty on both Roder and Sarnafil right now — and API.md makes tolerating
 * that a hard requirement. Returning null here means neither the heading nor
 * the surrounding padding renders, rather than an empty titled band.
 */

function usecaseBlock(id: string, raw: RawUseCase): SectionBlock | null {
  const items = (raw.items ?? []).map((item, index) => ({
    id: rowId(item, index),
    name: item.name,
    description: item.description ?? null,
  }));
  return items.length ? { kind: "useCase", id, title: raw.group_name, items } : null;
}

function nameImageBlock(id: string, raw: RawNameImage): SectionBlock | null {
  const items = (raw.items ?? []).map((item, index) => ({
    id: rowId(item, index),
    name: item.name,
    image: media(item.image),
  }));
  return items.length ? { kind: "nameImage", id, title: raw.group_name, items } : null;
}

function detailBlock(id: string, raw: RawDetail): SectionBlock | null {
  const items = (raw.items ?? []).map((item, index) => ({
    id: rowId(item, index),
    name: item.name,
    description: item.description ?? null,
    image: media(item.image),
  }));
  return items.length ? { kind: "detail", id, title: raw.group_name, items } : null;
}

function textBlock(id: string, raw: RawText): SectionBlock | null {
  const items = (raw.items ?? []).map((item, index) => ({
    id: rowId(item, index),
    description: item.description,
  }));
  return items.length ? { kind: "text", id, title: raw.group_name, items } : null;
}

function galleryBlock(id: string, raw: RawGallery): SectionBlock | null {
  // Every row here is nothing but an image, so a row without one has nothing
  // to show — dropped rather than rendered as an empty tile.
  const items = (raw.items ?? []).flatMap((item, index) => {
    const image = media(item.image);
    return image ? [{ id: rowId(item, index), image }] : [];
  });
  const description = raw.description ?? null;
  // Unlike the other sections, this one survives an empty `items`: its
  // description is content in its own right — the paragraph explaining what
  // flooring modul is — so the section still has something to say while the
  // gallery is waiting on uploads.
  return items.length || description
    ? { kind: "gallery", id, title: raw.group_name, description, items }
    : null;
}

function specBlock(id: string, raw: RawSpec): SectionBlock | null {
  const items = (raw.items ?? []).map((item, index) => ({
    id: rowId(item, index),
    label: item.label,
    value: item.value ?? null,
  }));
  return items.length ? { kind: "spec", id, title: raw.group_name, items } : null;
}

function faqBlock(id: string, raw: RawFaq): SectionBlock | null {
  const items = (raw.items ?? []).map((item, index) => ({
    id: rowId(item, index),
    question: item.question,
    answer: item.answer ?? null,
  }));
  return items.length ? { kind: "faq", id, title: raw.group_name, items } : null;
}

/**
 * `equipment_groups` is the one section that nests twice — groups, each with
 * its own items — and the one Peralatan Pendukung has instead of everything
 * else. Its heading lives on each group, so the block title is supplied by the
 * caller rather than read off the data.
 */
function equipmentBlock(
  id: string,
  title: string,
  raw: PeralatanPendukung["equipment_groups"]
): SectionBlock | null {
  const groups = (raw ?? []).flatMap((group, index) => {
    const items = (group.items ?? []).map((item, itemIndex) => ({
      id: rowId(item, itemIndex),
      name: item.name,
      image: media(item.image),
    }));
    return items.length
      ? [{ id: rowId(group, index), name: group.group_name, items }]
      : [];
  });
  return groups.length ? { kind: "equipment", id, title, groups } : null;
}

/** Discards the sections an editor has left empty, keeping CMS field order. */
function present(blocks: (SectionBlock | null)[]): SectionBlock[] {
  return blocks.filter((block): block is SectionBlock => block !== null);
}

/*
 * Section order per category. This mirrors the field order in
 * src/globals/*.ts — Sarnafil is Roder minus `jenis_roder` and
 * `pilihan_dinding`, with everything else in the same sequence — so a section
 * added to a global gets a line here and nothing else changes.
 */

function roderBlocks(data: Roder): SectionBlock[] {
  return present([
    usecaseBlock("use_cases", data.use_cases),
    nameImageBlock("size_variants", data.size_variants),
    nameImageBlock("jenis_roder", data.jenis_roder),
    detailBlock("pilihan_dinding", data.pilihan_dinding),
    specBlock("specifications", data.specifications),
    textBlock("yang_anda_dapatkan", data.yang_anda_dapatkan),
    galleryBlock("flooring_modul", data.flooring_modul),
    faqBlock("pertanyaan_umum", data.pertanyaan_umum),
  ]);
}

function sarnafilBlocks(data: Sarnafil): SectionBlock[] {
  return present([
    usecaseBlock("use_cases", data.use_cases),
    nameImageBlock("size_variants", data.size_variants),
    specBlock("specifications", data.specifications),
    textBlock("yang_anda_dapatkan", data.yang_anda_dapatkan),
    galleryBlock("flooring_modul", data.flooring_modul),
    faqBlock("pertanyaan_umum", data.pertanyaan_umum),
  ]);
}

function peralatanBlocks(data: PeralatanPendukung): SectionBlock[] {
  return present([
    equipmentBlock("equipment_groups", "Peralatan yang Tersedia", data.equipment_groups),
  ]);
}

/** A category page, flattened down to what the route renders. */
export type CategoryPage = {
  slug: CategorySlug;
  title: string;
  description: string | null;
  heroImage: MediaRef | null;
  blocks: SectionBlock[];
};

/** The header fields every category global shares, via `categoryHeaderFields`. */
type CategoryHeader = {
  title: string;
  description?: string | null;
  hero_image?: (number | null) | Media;
};

function toCategoryPage(
  slug: CategorySlug,
  header: CategoryHeader,
  blocks: SectionBlock[]
): CategoryPage {
  return {
    slug,
    title: header.title,
    description: header.description ?? null,
    heroImage: media(header.hero_image),
    blocks,
  };
}

/**
 * One category's content, normalised into ordered blocks.
 *
 * Reads through Payload's Local API rather than fetching /api/globals/<slug>
 * over HTTP: the CMS runs inside this app, so a request to our own route would
 * add a network hop and need an absolute URL that differs per environment.
 *
 * Returns null when Payload is unreachable, which the route turns into a 404
 * rather than a blank page — unlike the home page, there is no surrounding
 * content worth rendering without it.
 */
export async function getCategory(
  slug: CategorySlug
): Promise<CategoryPage | null> {
  try {
    const payload = await getPayload({ config });

    // `findGlobal` types its result from the literal slug, so each branch
    // passes its own literal. Reading it from the variable would return the
    // union of all three globals and every field access would need narrowing.
    // `draft: false` is Payload's default; stated because these globals have
    // drafts enabled and an unpublished edit must not reach the site.
    switch (slug) {
      case "roder": {
        const data = await payload.findGlobal({ slug, depth: 1, draft: false });
        return toCategoryPage(slug, data, roderBlocks(data));
      }
      case "sarnafil": {
        const data = await payload.findGlobal({ slug, depth: 1, draft: false });
        return toCategoryPage(slug, data, sarnafilBlocks(data));
      }
      case "peralatan-pendukung": {
        const data = await payload.findGlobal({ slug, depth: 1, draft: false });
        return toCategoryPage(slug, data, peralatanBlocks(data));
      }
    }
  } catch (error) {
    console.error(`[categories] could not load "${slug}" from Payload:`, error);
    return null;
  }
}
