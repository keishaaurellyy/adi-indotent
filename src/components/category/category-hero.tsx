import { Container, ImageFrame } from "@/components/ui";
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
 * The light counterpart to the /events header. There the photo is a backdrop
 * masked behind the heading; here it is the subject — the product being sold —
 * so it sits below the copy as its own framed block on white. That also drops
 * the legibility problem the dark hero had to mask around: nothing overlaps the
 * text, so any image an editor uploads is safe.
 */
export function CategoryHero({ title, description, image }: CategoryHeroProps) {
  return (
    <section className="bg-background-grey pt-10 pb-12 lg:pt-16 lg:pb-16">
      <Container>
        {/* The only h1 on the page — every section heading below is an h2. */}
        <h1 className="rise-in text-h1 font-bold text-foreground">{title}</h1>

        {description && (
          // Uncapped: the design runs this to the same edge as the photo
          // below it, so a max-width would leave the two ragged against each
          // other.
          <p className="rise-in mt-5 text-body-xl font-normal text-foreground-secondary [--rise-delay:100ms]">
            {description}
          </p>
        )}

        {image && (
          // Fixed ratio rather than the file's own: the three globals hold
          // photos of different shapes, and a ratio that shifts per category
          // would move every section below the fold by a different amount.
          <ImageFrame
            // Content, not decoration — unlike the dark hero, where the photo
            // sat behind the heading and was marked aria-hidden.
            src={image.url}
            alt={image.alt}
            sizes="(min-width: 1024px) 81.5rem, 100vw"
            quality={90}
            preload
            className="rise-in mt-8 aspect-4/3 rounded-xl [--rise-delay:200ms] lg:mt-10 lg:aspect-2/1"
            imageClassName="object-center"
          />
        )}
      </Container>
    </section>
  );
}
