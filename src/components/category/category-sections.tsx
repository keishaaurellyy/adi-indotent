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
function SectionRenderer({ block }: { block: SectionBlock }) {
  switch (block.kind) {
    case "useCase":
      return <UseCaseGrid block={block} />;
    case "nameImage":
      // The one place a shape is not enough to pick the look:
      // `size_variants` holds line diagrams that need a white field and a
      // border, while `jenis_roder` holds photos that sit on grey. This is
      // what `id` recording the originating field is for.
      return (
        <NameImageGrid
          block={block}
          frame={block.id === "size_variants" ? "outlined" : "plain"}
        />
      );
    case "detail":
      return <DetailGrid block={block} />;
    case "text":
      return <TextList block={block} />;
    case "gallery":
      return <ImageGallery block={block} />;
    case "spec":
      return <SpecTable block={block} />;
    case "faq":
      return <FaqAccordion block={block} />;
    case "equipment":
      return <EquipmentGroups block={block} />;
  }
}

export function CategorySections({ blocks }: { blocks: SectionBlock[] }) {
  return (
    <>
      {/* Every section sits on white. The cards inside carry the grey, so
          banding the sections too would leave the cards with nothing to
          separate them from their own background. */}
      {blocks.map((block) => (
        <SectionRenderer key={block.id} block={block} />
      ))}
    </>
  );
}
