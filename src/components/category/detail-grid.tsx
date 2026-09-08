import Image from "next/image";
import { CardDescription, CardTitle } from "@/components/ui";
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
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {block.items.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl bg-background-grey p-4 lg:p-5"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-grey-40">
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
