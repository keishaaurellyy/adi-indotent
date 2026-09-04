import Image from "next/image";
import { CardTitle } from "@/components/ui";
import { SectionShell } from "./section-shell";
import type { SectionBlock } from "@/lib/categories";

type Props = {
  block: Extract<SectionBlock, { kind: "nameImage" }>;
  tone?: "default" | "muted";
};

/**
 * Photo tiles with a caption. Serves both `jenis_roder` and `size_variants` —
 * `fields/sections.ts` builds the two from identical item fields, so they get
 * one renderer rather than two that would drift apart.
 *
 * The image well keeps its aspect ratio whether or not a photo is attached, so
 * a section that is half-illustrated does not render as ragged rows.
 */
export function NameImageGrid({ block, tone }: Props) {
  return (
    <SectionShell title={block.title} tone={tone}>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {block.items.map((item) => (
          <li key={item.id}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-grey-40">
              {item.image && (
                <Image
                  src={item.image.url}
                  alt={item.image.alt || item.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
            <CardTitle className="mt-4">{item.name}</CardTitle>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
