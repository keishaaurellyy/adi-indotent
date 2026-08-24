import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  CardDescription,
  CardTitle,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";

export type ProductCollectionItem = {
  title: string;
  description: string;
  href: string;
  /** Product photo. The tile renders as a plain block when absent. */
  image?: StaticImageData | string;
};

type ProductCollectionProps = {
  title?: string;
  description?: string;
  items?: ProductCollectionItem[];
};

/** Copy from the Figma frame, pending a Payload collection. */
const defaultItems: ProductCollectionItem[] = [
  {
    title: "Roder",
    description:
      "Tenda Roder tersedia dalam berbagai ukuran, mulai dari 10m hingga 25m",
    href: "/products/roder",
    image: "/roder/card.jpg",
  },
  {
    title: "Sarnafil",
    description: "Atap membran PVC berkualitas tinggi untuk acara outdoor.",
    href: "/products/sarnafil",
    image: "/sarnafil/card.jpg",
  },
  {
    title: "Peralatan Pendukung",
    description: "Kursi, meja, AC, dan misty fan untuk kenyamanan acara.",
    href: "/products/peralatan-pendukung",
    image: "/peralatan-pendukung/card.jpg",
  },
];

export function ProductCollection({
  title = "Koleksi Tenda Kami untuk Segala Kebutuhan Acara",
  description = "Beragam pilihan tenda kami sediakan untuk mendukung kelancaran acara, lengkap dengan pemasangan yang cepat dan rapi",
  items = defaultItems,
}: ProductCollectionProps) {
  return (
    <Section>
      <Container size="lg">
        <SectionHeading align="center" title={title} description={description} />

        {/*
          Figma has the three cards flush against each other, sharing 1px
          dividers inside one rounded outline — hence `divide-*` rather than
          a gap between separate cards.
        */}
        <div className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-lg border border-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col p-6 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
            >
              {/* Figma: 365.333x320 (aspect 1.1417) with a 12px radius. */}
              <div className="relative aspect-[1097/960] w-full overflow-hidden rounded-xl bg-grey-40">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <CardTitle className="mt-6">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
