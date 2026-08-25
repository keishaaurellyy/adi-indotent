import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui";
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
        Figma frame 163-239 is 1440x2057 (hug), of which the dark header
        measures ~694 — ~796 on the 375 mobile frame. Reproduced as padding
        rather than a height so the header hugs its text the way the frame
        does: pt reserves the overlaid navbar (96 desktop, 66 mobile) plus the
        clear space the design leaves above the title (100 and ~74).
      */}
      <section className="relative isolate overflow-hidden bg-background-dark pt-35 pb-6 lg:pt-49 lg:pb-25">
        
        <Image
          src="/contact-bg.svg"
          alt=""
          width={1440}
          height={1395}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-auto w-full select-none"
        />

        <Container>
         
          <div className="lg:flex lg:items-center lg:justify-between lg:gap-16">
            <h1 className="text-h1 font-semibold text-foreground-light">
              Kami Siap{" "}
              <br />
              Membantu{" "}
              <br className="lg:hidden" />
              Anda
            </h1>

            <div className="mt-8 lg:mt-0 lg:max-w-100 lg:shrink-0 items-center">
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

          {/* Two equal columns of the 1240 content width from lg, stacked below. */}
          <dl className="mt-10 grid gap-4 lg:mt-18 lg:grid-cols-2 lg:gap-6">
            <InfoCard icon="/icon/clock-icon.svg" label="Jam buka">
              {OPENING_HOURS}
            </InfoCard>
            <InfoCard icon="/icon/marker-pin-icon.svg" label="Lokasi">
              {ADDRESS}
            </InfoCard>
          </dl>
        </Container>
      </section>

      <section className="pt-24 pb-8">
        <Container>
          <SectionHeading align="center" title="Temukan Kami Disini" />
          <iframe
            src={MAPS_EMBED_URL}
            title={`Peta lokasi Adi Indotent — ${ADDRESS}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="block h-148 w-full rounded-xl border-0 lg:h-162.5"
          />
        </Container>
      </section>

    
      <SiteFooter showCta={false} />
    </>
  );
}
