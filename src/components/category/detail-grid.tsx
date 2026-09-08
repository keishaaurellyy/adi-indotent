import {
  CARD_GRID,
  CARD_GRID_SIZES,
  CardDescription,
  CardTitle,
  ImageFrame,
} from "@/components/ui";
import { SectionShell } from "./section-shell";
import type { SectionBlock } from "@/lib/categories";

/**
 * Photo, name and description together. Used by `pilihan_dinding` on Roder,
 * the only section carrying all three fields.
 *
 * Same three-column grey card as the photo tiles above it, with the
 * description added underneath — the design deliberately keeps the two
 * sections reading as one family rather than giving this one its own frame.
 */
type Props = {
  block: Extract<SectionBlock, { kind: "detail" }>;
  tone?: "default" | "muted";
};

export function DetailGrid({ block, tone }: Props) {
  return (
    <SectionShell title={block.title} tone={tone}>
      <ul className={CARD_GRID}>
        {block.items.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl bg-background-grey p-4 lg:p-5"
          >
            <ImageFrame
              src={item.image?.url}
              alt={item.image?.alt || item.name}
              sizes={CARD_GRID_SIZES}
              className="aspect-4/3 rounded-xl bg-grey-40"
            />
            <div className="mt-5 px-1 pb-2">
              <CardTitle>{item.name}</CardTitle>
              {item.description && (
                <CardDescription>{item.description}</CardDescription>
              )}
            </div>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
