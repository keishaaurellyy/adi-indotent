import Image from "next/image";
import { CardDescription, CardTitle } from "@/components/ui";
import { SectionShell } from "./section-shell";
import type { SectionBlock } from "@/lib/categories";

type Props = {
  block: Extract<SectionBlock, { kind: "detail" }>;
  tone?: "default" | "muted";
};

/**
 * Photo, name and description together. Used by `pilihan_dinding` on Roder,
 * the only section carrying all three fields.
 *
 * Wider tiles than the other grids — the description needs the room — so this
 * caps at two columns rather than three.
 */
export function DetailGrid({ block, tone }: Props) {
  return (
    <SectionShell title={block.title} tone={tone}>
      <ul className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {block.items.map((item) => (
          <li
            key={item.id}
            className="overflow-hidden rounded-xl border border-border bg-background"
          >
            <div className="relative aspect-[16/9] w-full bg-grey-40">
              {item.image && (
                <Image
                  src={item.image.url}
                  alt={item.image.alt || item.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-6">
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
