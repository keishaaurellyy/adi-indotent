import Image from "next/image";
import {
  CardDescription,
  CardTitle,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";

export type Reason = {
  title: string;
  description: string;
  /** 48x48 tile from public/icon — the SVG carries its own cyan background. */
  icon: string;
};

type WhyChooseUsProps = {
  title?: string;
  description?: string;
  reasons?: Reason[];
};

/** Copy transcribed from the Figma frame. */
const defaultReasons: Reason[] = [
  {
    title: "Tim Profesional",
    description:
      "Didukung tenaga kerja berpengalaman untuk pemasangan tenda yang rapi dan profesional",
    icon: "/icon/tim-profesional.svg",
  },
  {
    title: "Berpengalaman",
    description:
      "Lebih dari 10 tahun melayani penyewaan Tenda Roder untuk berbagai jenis acara",
    icon: "/icon/berpengalaman.svg",
  },
  {
    title: "Kualitas Terjamin",
    description:
      "Tenda yang bersih, kokoh, dan terawat untuk memaksimalkan kenyamanan setiap acara",
    icon: "/icon/kualitas-terjamin.svg",
  },
  {
    title: "Harga Terjangkau",
    description:
      "Menawarkan harga terbaik dengan kualitas layanan yang tetap terjamin",
    icon: "/icon/harga-terjangkau.svg",
  },
  {
    title: "Tepat Waktu",
    description:
      "Pengiriman dan pemasangan dilakukan sesuai jadwal yang telah disepakati",
    icon: "/icon/tepat-waktu.svg",
  },
  {
    title: "Pelayanan Responsif",
    description:
      "Siap membantu kebutuhan Anda dengan pelayanan yang cepat dan ramah",
    icon: "/icon/pelayanan-responsif.svg",
  },
];

export function WhyChooseUs({
  title = "Mengapa Harus Memilih Kami?",
  description = "Kami hadir dengan pelayanan terpercaya demi kepuasan dan kenyamanan anda, mulai dari konsultasi awal hingga acara selesai",
  reasons = defaultReasons,
}: WhyChooseUsProps) {
  // `muted` resolves to grey-20, the design's background-grey.
  return (
    <Section tone="muted">
      <Container size="lg">
        <SectionHeading
          align="center"
          title={title}
          description={description}
          // Title needs 706px to stay on one line; the description breaks
          // after "anda," anywhere between 659px and 708px.
          maxWidth="none"
          descriptionMaxWidth="42.5rem"
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {reasons.map((reason) => (
            <li
              key={reason.title}
              className="rounded-xl border border-border bg-background p-6"
            >
              {/* Next serves .svg unoptimized automatically. */}
              <Image src={reason.icon} alt="" width={48} height={48} aria-hidden />
              <CardTitle className="mt-4">{reason.title}</CardTitle>
              <CardDescription>{reason.description}</CardDescription>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
