import { PhotoCard } from "./photo-card";
import { SectionShell } from "./section-shell";
import { CARD_GRID, CARD_GRID_SIZES } from "./card-grid";
import type { SectionBlock } from "@/lib/categories";

type Props = {
  block: Extract<SectionBlock, { kind: "nameImage" }>;
  /** See `PhotoCard` — `size_variants` is the outlined one. */
  frame?: "plain" | "outlined";
  tone?: "default" | "muted";
};

/**
 * Photo tiles with a caption. Serves both `jenis_roder` and `size_variants` —
 * `fields/sections.ts` builds the two from identical item fields, so they get
 * one renderer rather than two that would drift apart.
 */
export function NameImageGrid({ block, frame = "plain", tone }: Props) {
  return (
    <SectionShell title={block.title} tone={tone}>
      <ul className={CARD_GRID}>
        {block.items.map((item) => (
          <li key={item.id}>
            <PhotoCard
              name={item.name}
              image={item.image}
              frame={frame}
              sizes={CARD_GRID_SIZES}
            />
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
