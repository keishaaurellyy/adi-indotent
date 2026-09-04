import { DetailGrid } from "./detail-grid";
import { EquipmentGroups } from "./equipment-groups";
import { FaqAccordion } from "./faq-accordion";
import { ImageGallery } from "./image-gallery";
import { NameImageGrid } from "./name-image-grid";
import { SpecTable } from "./spec-table";
import { TextList } from "./text-list";
import { UseCaseGrid } from "./use-case-grid";
import type { SectionBlock } from "@/lib/categories";

/**
 * The registry: one renderer per item shape, dispatched on `block.kind`.
 *
 * This is the seam that keeps three category pages from becoming three page
 * components. Roder and Sarnafil share six of their eight sections, so pairing
 * renderers with *shapes* rather than with categories means the shared six are
 * written once. Which sections a category shows, and in what order, is decided
 * in `lib/categories.ts`; this file only knows how each shape looks.
 *
 * The switch is exhaustive over the union, so adding a `kind` there is a
 * compile error here until it has a renderer.
 */
function SectionRenderer({
  block,
  tone,
}: {
  block: SectionBlock;
  tone: "default" | "muted";
}) {
  switch (block.kind) {
    case "useCase":
      return <UseCaseGrid block={block} tone={tone} />;
    case "nameImage":
      return <NameImageGrid block={block} tone={tone} />;
    case "detail":
      return <DetailGrid block={block} tone={tone} />;
    case "text":
      return <TextList block={block} tone={tone} />;
    case "gallery":
      return <ImageGallery block={block} tone={tone} />;
    case "spec":
      return <SpecTable block={block} tone={tone} />;
    case "faq":
      return <FaqAccordion block={block} tone={tone} />;
    case "equipment":
      return <EquipmentGroups block={block} tone={tone} />;
  }
}

export function CategorySections({ blocks }: { blocks: SectionBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <SectionRenderer
          key={block.id}
          block={block}
          // Banded backgrounds, so neighbouring sections stay distinguishable
          // however many the category happens to have. Alternating on the
          // rendered index rather than a per-section setting keeps the rhythm
          // unbroken when an empty section drops out.
          tone={index % 2 === 1 ? "muted" : "default"}
        />
      ))}
    </>
  );
}
