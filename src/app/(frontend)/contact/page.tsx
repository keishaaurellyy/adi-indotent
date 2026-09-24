import Image from "next/image";
import { Button, Container, Reveal, Section, SectionHeading } from "@/components/ui";
import { Navbar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  ADDRESS,
  MAPS_EMBED_URL,
  OPENING_DAYS,
  OPENING_HOURS_TIME,
  WHATSAPP_CONTACTS,
} from "@/lib/contact";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Hubungi kami untuk informasi lebih lanjut seputar produk dan layanan yang kami sediakan.",
  path: "/contact",
});

function WhatsappCard() {
  return (
    <>
      <h2 className="text-h6 font-semibold whitespace-nowrap text-foreground lg:text-h5">
        Hubungi Melalui Whatsapp
      </h2>
      <p className="mt-2 text-body-lg text-foreground-secondary">
        Dapat menghubungi kami melalui nomor WhatsApp berikut.
      </p>

      <ul className="mt-6 divide-y divide-border">
        {WHATSAPP_CONTACTS.map((contact) => (
          <li
            key={contact.url}
            className="flex items-center justify-between gap-3 py-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              {/* The icon is a flat glyph, so the WhatsApp-brand halo behind
                  it is drawn here rather than baked into the SVG. */}
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10">
                <Image
                  src="/icon/whatsapp-icon.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden
                  className="size-5"
                />
              </span>
              <div className="min-w-0">
                <p className="text-body-lg font-semibold text-foreground">
                  {contact.name}
                  {contact.tag && (
                    <span className="ml-1 text-body-md font-normal text-foreground-secondary">
                      ({contact.tag})
                    </span>
                  )}
                </p>
                <p className="text-body-md text-foreground-secondary">
                  {contact.display}
                </p>
              </div>
            </div>

            <Button
              href={contact.url}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              className="shrink-0 whitespace-nowrap"
            >
              Kirim pesan
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
}

function OperationalInfoCard() {
  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Image
            src="/icon/calendar-icon.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden
            className="size-6"
          />
          <p className="mt-4 text-body-md text-foreground-secondary">
            Hari Operasional
          </p>
          <p className="mt-2 text-body-xl text-foreground">{OPENING_DAYS}</p>
        </div>
        <div>
          <Image
            src="/icon/clock-icon.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden
            className="size-6"
          />
          <p className="mt-4 text-body-md text-foreground-secondary">
            Jam Operasional
          </p>
          <p className="mt-2 text-body-xl text-foreground">
            {OPENING_HOURS_TIME}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Image
          src="/icon/marker-pin-icon.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden
          className="size-6"
        />
        <p className="mt-4 text-body-md text-foreground-secondary">Lokasi</p>
        <p className="mt-2 text-body-xl text-foreground">{ADDRESS}</p>
      </div>
    </>
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
        <section className="pt-35 pb-16 lg:pt-49 lg:pb-10">
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
              </div>
            </div>
          </Container>
        </section>

        <div className="pb-10 lg:pb-16">
          <Container>
            {/* Two separate cards, stacked below lg and an even split of
                the 1240 content width from lg. */}
            <Reveal group className="grid gap-4 lg:grid-cols-2 lg:gap-6">
              <div className="h-full rounded-xl bg-background p-6 lg:p-8">
                <WhatsappCard />
              </div>
              <div className="h-full rounded-xl bg-background p-6 lg:p-8">
                <OperationalInfoCard />
              </div>
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
