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
 * Note this renders nowhere today: `flooring_modul.items` is empty on both
 * Roder and Sarnafil because the gallery is not in Figma yet, and the
 * normaliser drops empty sections. It is here so that filling the array in the
 * admin is all it takes — the explanatory copy already written into
 * `flooring_modul.description` appears with it.
 */
export function ImageGallery({ block, tone }: Props) {
  return (
    <SectionShell title={block.title} description={block.description} tone={tone}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {block.items.map((item) => (
          <li
            key={item.id}
            className="relative aspect-[4/3] overflow-hidden rounded-xl bg-grey-40"
          >
            <Image
              src={item.image.url}
              alt={item.image.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
