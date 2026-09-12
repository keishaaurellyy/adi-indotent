import {
  CARD_GRID,
  CARD_GRID_SIZES,
  Container,
  Reveal,
  Section,
} from "@/components/ui";
import { PhotoCard } from "./photo-card";
import type { SectionBlock } from "@/lib/categories";

type Props = {
  block: Extract<SectionBlock, { kind: "equipment" }>;
  tone?: "default" | "muted";
};

/**
 * Peralatan Pendukung's whole page body: named groups, each holding its own
 * tiles — the same captioned photo card the other categories use.
 *
 * The only section that nests twice, and the only one this category has — it
 * shares no sections with Roder or Sarnafil. That also makes it the only one
 * to skip `SectionShell`: with no section heading above them, the group names
 * are the page's h2s, so the outline runs straight from the hero's h1 to them.
 */
export function EquipmentGroups({ block, tone }: Props) {
  return (
    <Section tone={tone}>
      <Container size="lg">
        <div className="grid gap-12 lg:gap-16">
          {block.groups.map((group) => (
            <section key={group.id}>
              <Reveal>
                <h2 className="text-h5 font-semibold text-foreground">
                  {group.name}
                </h2>
              </Reveal>
              <Reveal as="ul" group className={`mt-6 ${CARD_GRID}`}>
                {group.items.map((item) => (
                  <li key={item.id}>
                    <PhotoCard
                      name={item.name}
                      image={item.image}
                      sizes={CARD_GRID_SIZES}
                    />
                  </li>
                ))}
              </Reveal>
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
