import Image from "next/image";
import { cn } from "@/lib/cn";
import { CardTitle } from "@/components/ui";
import { SectionShell } from "./section-shell";
import type { SectionBlock } from "@/lib/categories";

type Props = {
  block: Extract<SectionBlock, { kind: "nameImage" }>;
  /**
   * Same item shape, two frames in the design.
   *
   * `plain` is the photo treatment (`jenis_roder`): a grey card the photo sits
   * inside. `outlined` is for `size_variants`, whose images are line diagrams
   * on white — they need a white field to sit on and a border to read as a
   * card at all, and they must not be cropped, so they are contained rather
   * than covered.
   */
  frame?: "plain" | "outlined";
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
export function NameImageGrid({ block, frame = "plain", tone }: Props) {
  const outlined = frame === "outlined";

  return (
    <SectionShell title={block.title} tone={tone}>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {block.items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "rounded-2xl p-4 lg:p-5",
              outlined
                ? "border border-border bg-background"
                : "bg-background-grey"
            )}
          >
            <div
              className={cn(
                "relative aspect-4/3 w-full overflow-hidden rounded-xl",
                !outlined && "bg-grey-40"
              )}
            >
              {item.image && (
                <Image
                  src={item.image.url}
                  alt={item.image.alt || item.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className={cn(
                    outlined ? "object-contain" : "object-cover"
                  )}
                />
              )}
            </div>
            <CardTitle className="mt-5 px-1">{item.name}</CardTitle>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
