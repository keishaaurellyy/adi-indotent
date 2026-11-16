import { Container, ImageFrame, Reveal, Section } from "@/components/ui";

type TrustedSolutionProps = {
  title?: string;
  /** One entry per paragraph. */
  paragraphs?: string[];
  images?: { src: string; alt: string }[];
};

/** Copy from the Figma frame, pending a Payload collection. */
const defaultParagraphs = [
  "Adi Indotent menyediakan Tenda Roder dan Tenda Sarnafil berkualitas untuk berbagai kebutuhan, mulai dari pameran, bazaar, wedding, event korporat, gudang penyimpanan, kantor sementara, dan berbagai kebutuhan lainnya.",
  "Berdiri sejak 2013, Adi Indotent telah dipercaya menangani lebih dari 2.000 proyek di berbagai wilayah Indonesia. Dengan pengalaman dan komitmen terhadap kualitas serta pelayanan profesional, Adi Indotent menghadirkan solusi tenda dengan konstruksi yang kokoh, pemasangan yang cepat, dan fleksibilitas penggunaan untuk mendukung berbagai acara maupun kebutuhan operasional.",
];

const defaultImages = [
  {
    src: "/home/solusi-1.jpg",
    alt: "Tenda roder terpasang di lapangan olahraga",
  },
  {
    src: "/home/solusi-2.jpg",
    alt: "Deretan tenda sarnafil di area acara outdoor",
  },
];

export function TrustedSolution({
  title = "Solusi Tenda Terpercaya",
  paragraphs = defaultParagraphs,
  images = defaultImages,
}: TrustedSolutionProps) {
  return (
    <Section>
      <Container size="lg">
        {/* Two equal columns with a 48px gutter from lg up. */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            {/* 32px on mobile, 40px from lg — between our h2 and h3 steps. */}
            <h2 className="text-[2rem]/[1.2] font-semibold lg:text-h3">
              {title}
            </h2>
            <div className="mt-6 flex flex-col gap-4">
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-body-xl text-foreground-secondary"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          {/*
            The pair reads as one rounded block: only the outer corners are
            rounded (12px), so the facing inner corners stay square. It
            arrives half a beat behind the prose, so the two columns read
            left to right rather than landing as one wall.
          */}
          <Reveal className="flex flex-col gap-4 [--reveal-delay:120ms]">
            {images.map((image) => (
              <ImageFrame
                key={image.src}
                src={image.src}
                alt={image.alt}
                sizes="(min-width: 1024px) 596px, 100vw"
                className="aspect-327/182 first:rounded-t-xl last:rounded-b-xl lg:aspect-632/211"
              />
            ))}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
