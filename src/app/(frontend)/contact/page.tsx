import Image from "next/image";
import { Container, Reveal, Section, SectionHeading } from "@/components/ui";
import { Navbar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  ADDRESS,
  MAPS_EMBED_URL,
  OPENING_HOURS,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/contact";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Hubungi kami untuk informasi lebih lanjut seputar produk dan layanan yang kami sediakan.",
  path: "/contact",
});

function InfoCard({
  icon,
  label,
  children,
}: {
  /** Path under public/. The file carries its own stroke colour. */
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-background p-4 lg:p-6">
      <dt className="text-body-md text-foreground-secondary">
        <Image
          src={icon}
          alt=""
          width={24}
          height={24}
          className="mb-4 size-6 lg:mb-6"
        />
        {label}
      </dt>
      {/* pre-line so a \n in the value breaks the line; HTML would collapse it. */}
      <dd className="mt-2 text-body-xl whitespace-pre-line text-foreground">
        {children}
      </dd>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      {/* The navbar overlays the dark header, as on the home and events pages. */}
      <Navbar />

      {/*
        The dark panel spans the hero and the info cards, as on the events
        page, so the cards read as part of the header rather than a new
        section — the whole panel is one visual unit before the page turns
        light for the map.
      */}
      <div className="relative isolate overflow-hidden bg-background-dark">
        {/* The header's whole backdrop, and above the fold on every viewport,
            so it loads with the page instead of waiting to be scrolled near. */}
        <Image
          src="/contact-bg.svg"
          alt=""
          width={1440}
          height={1395}
          loading="eager"
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-auto w-full select-none"
        />

        {/* pt reserves the overlaid navbar (96 desktop, 66 mobile) plus the
            clear space the design leaves above the title (100 and ~74). */}
        <section className="pt-35 pb-6 lg:pt-49 lg:pb-10">
          <Container>
            <div className="lg:flex lg:items-center lg:justify-between lg:gap-16">
              <h1 className="rise-in text-h1 font-semibold text-foreground-light">
                Kami Siap{" "}
                <br />
                Membantu{" "}
                <br className="lg:hidden" />
                Anda
              </h1>

              <div className="rise-in mt-8 items-center [--rise-delay:100ms] lg:mt-0 lg:max-w-100 lg:shrink-0">
                <p className="text-body-lg text-foreground-light">
                  Hubungi kami untuk informasi lebih lanjut seputar produk dan
                  layanan yang kami sediakan
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  // border-b, not underline: text-decoration does not paint
                  // across a replaced flex item, so an underline would start
                  // after the icon. The border spans the whole box.
                  className="mt-4 inline-flex items-center gap-2 border-b border-current pb-1 text-h5 font-medium text-[#25D366] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground-light"
                >
                  <Image
                    src="/icon/whatsapp-icon.svg"
                    alt=""
                    width={32}
                    height={32}
                    className="size-6"
                  />
                  {WHATSAPP_DISPLAY}
                </a>
              </div>
            </div>
          </Container>
        </section>

        <div className="pb-10 lg:pb-16">
          <Container>
            {/* Two equal columns of the 1240 content width from lg, stacked below. */}
            <Reveal
              as="dl"
              group
              className="grid gap-4 lg:grid-cols-2 lg:gap-6"
            >
              <InfoCard icon="/icon/clock-icon.svg" label="Jam buka">
                {OPENING_HOURS}
              </InfoCard>
              <InfoCard icon="/icon/marker-pin-icon.svg" label="Lokasi">
                {ADDRESS}
              </InfoCard>
            </Reveal>
          </Container>
        </div>
      </div>

      <Section tone="muted">
        <Container>
          <SectionHeading align="center" title="Temukan Kami Disini" />
          <Reveal>
            <iframe
              src={MAPS_EMBED_URL}
              title={`Peta lokasi Adi Indotent — ${ADDRESS}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block h-148 w-full rounded-xl border-0 lg:h-162.5"
            />
          </Reveal>
        </Container>
      </Section>

      <SiteFooter showCta={false} />
    </>
  );
}
