import Image from "next/image";
import Link from "next/link";
import {
  CardDescription,
  CardTitle,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";
import type { ProductSummary } from "@/lib/products";

type ProductCollectionProps = {
  title?: string;
  description?: string;
  /** Category cards from Payload. Empty when the CMS is unreachable. */
  items: ProductSummary[];
};

export function ProductCollection({
  // The section heading has no CMS fields of its own — only the cards are
  // editable — so this copy stays with the component.
  title = "Koleksi Tenda Kami untuk Segala Kebutuhan Acara",
  description = "Beragam pilihan tenda kami sediakan untuk mendukung kelancaran acara, lengkap dengan pemasangan yang cepat dan rapi",
  items,
}: ProductCollectionProps) {
  return (
    <Section>
      <Container size="lg">
        <SectionHeading align="center" title={title} description={description} />

        {/*
          Skipped entirely when there are no cards: the outline below is what
          groups them, so on its own it would render as an empty bordered box.
        */}
        {items.length > 0 && (
          /*
            Figma has the three cards flush against each other, sharing 1px
            dividers inside one rounded outline — hence `divide-*` rather than
            a gap between separate cards.
          */
          <div className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-lg border border-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group flex flex-col p-6 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
              >
                {/* Figma: 365.333x320 (aspect 1.1417) with a 12px radius. */}
                <div className="relative aspect-[1097/960] w-full overflow-hidden rounded-xl bg-grey-40">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.imageAlt || item.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <CardTitle className="mt-6">{item.title}</CardTitle>
                {item.description && (
                  <CardDescription>{item.description}</CardDescription>
                )}
              </Link>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
