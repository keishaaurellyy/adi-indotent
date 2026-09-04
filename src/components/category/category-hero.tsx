import Image from "next/image";
import { Container } from "@/components/ui";
import type { MediaRef } from "@/lib/categories";

type CategoryHeroProps = {
  title: string;
  description: string | null;
  image: MediaRef | null;
};

/**
 * Page header for a category, driven by the three `categoryHeaderFields` every
 * category global shares.
 *
 * Mirrors the /events header: the hero photo sits at 30% behind a
 * top-to-transparent mask so the heading stays legible over any image an
 * editor uploads.
 */
export function CategoryHero({ title, description, image }: CategoryHeroProps) {
  return (
    <section className="relative flex items-center overflow-hidden bg-background-dark pt-45 pb-20 min-h-132.5 lg:min-h-123.25 lg:pt-24 lg:pb-0">
      {image && (
        <Image
          src={image.url}
          alt=""
          fill
          sizes="100vw"
          quality={90}
          loading="eager"
          aria-hidden
          className="pointer-events-none select-none object-cover object-center opacity-30 mask-[linear-gradient(to_bottom,black,transparent_69.88%)]"
        />
      )}

      <Container className="relative">
        {/* The only h1 on the page — every section heading below is an h2. */}
        <h1 className="text-h1 font-semibold text-foreground-light">{title}</h1>
        {description && (
          <p className="mt-6 max-w-3xl text-body-xl font-normal text-foreground-light">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
