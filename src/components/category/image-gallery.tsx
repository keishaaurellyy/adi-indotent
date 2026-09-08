import Image from "next/image";
import { SectionShell } from "./section-shell";
import type { SectionBlock } from "@/lib/categories";

type Props = {
  block: Extract<SectionBlock, { kind: "gallery" }>;
  tone?: "default" | "muted";
};

/**
 * A plain photo grid. Used by `flooring_modul`, the one section that carries a
 * description of its own alongside `group_name`.
 *
 * Four across, wider than the three-column card grids above it: these are
 * flooring swatches being compared at a glance, not cards with copy to read.
 *
 * The photos are not in the CMS yet, so today this renders as heading plus
 * description and nothing else — which is the point of keeping the section
 * alive on an empty `items`. Uploading them in the admin is all it takes.
 */
export function ImageGallery({ block, tone }: Props) {
  return (
    <SectionShell title={block.title} description={block.description} tone={tone}>
      {block.items.length > 0 && (
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {block.items.map((item) => (
            <li
              key={item.id}
              className="relative aspect-square overflow-hidden rounded-xl bg-grey-40"
            >
              <Image
                src={item.image.url}
                alt={item.image.alt}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      )}
    </SectionShell>
  );
}
