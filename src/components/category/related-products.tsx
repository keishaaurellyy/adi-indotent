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

type RelatedProductsProps = {
  /** The other categories — the current one is filtered out by the page. */
  items: ProductSummary[];
};

/**
 * Cross-links to the other two categories, closing every detail page.
 *
 * Cards rather than the home page's flush divided row: there are only ever two
 * here, and a two-cell version of that outlined row reads as a table with a
 * column missing. These match the grey cards used by the sections above
 * instead, so the page ends in the same visual language it ran in.
 *
 * Centred heading, unlike every section above it — the design uses the change
 * to mark this as the page's outro rather than more product detail.
 */
export function RelatedProducts({ items }: RelatedProductsProps) {
  // Nothing to cross-link to when the CMS is unreachable, and a lone heading
  // over empty space is worse than no section.
  if (items.length === 0) return null;

  return (
    <Section>
      <Container size="lg">
        <SectionHeading
          align="center"
          title="Lihat Juga Produk Kami Lainnya"
          maxWidth="32rem"
        />

        <ul className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl bg-background-grey p-4 transition-colors hover:bg-grey-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:p-5"
              >
                <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl bg-grey-40">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.imageAlt || item.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="mt-6 px-1 pb-2">
                  <CardTitle>{item.title}</CardTitle>
                  {item.description && (
                    <CardDescription>{item.description}</CardDescription>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
