import Image from "next/image";
import { CardTitle } from "@/components/ui";
import { SectionShell } from "./section-shell";
import type { SectionBlock } from "@/lib/categories";

type Props = {
  block: Extract<SectionBlock, { kind: "equipment" }>;
  tone?: "default" | "muted";
};

/**
 * Peralatan Pendukung's whole page body: named groups, each holding its own
 * item tiles.
 *
 * The only section that nests twice, and the only one this category has — it
 * shares no sections with Roder or Sarnafil. Each group's name is an h3 under
 * the section's h2, so the outline stays ordered.
 */
export function EquipmentGroups({ block, tone }: Props) {
  return (
    <SectionShell title={block.title} tone={tone}>
      <div className="grid gap-12 lg:gap-16">
        {block.groups.map((group) => (
          <section key={group.id}>
            <h3 className="text-h5 font-semibold text-foreground">
              {group.name}
            </h3>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {group.items.map((item) => (
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
          </section>
        ))}
      </div>
    </SectionShell>
  );
}
