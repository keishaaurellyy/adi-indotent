import type { Metadata } from "next";
import Image from "next/image";
import { Container, EventCard, Section } from "@/components/ui";
import { Navbar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { getAllEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "Events | Adi Indotent",
  description:
    "Pengalaman menangani berbagai jenis acara membuat kami paham kebutuhan setiap klien, sehingga hasilnya selalu sesuai harapan.",
};

/** Same five-minute window as the home rail — both read the same collection. */
export const revalidate = 300;

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <>
      {/* The navbar overlays the dark header, exactly as on the home page. */}
      <Navbar />

      {/*
        The header and the grid share one painted background rather than each
        carrying bg-background-dark. Two dark rectangles meeting at a
        fractional boundary (the header hugs its text, so it lands on 552.8125)
        round to device pixels independently, leaving a hairline of the white
        body showing through between them.
      */}
      <div className="bg-background-dark">
        {/*
          Figma frames: 1440x493 desktop, 375x530 mobile — both are heights
          the frame hugs to rather than fixed values, hence min-h. The top
          padding reserves the overlaid navbar (96 desktop, 66 mobile); on
          mobile it also adds the design's 114px of clear space above the
          title, while on desktop items-center splits the remainder evenly.
        */}
        <section className="relative flex items-center overflow-hidden pt-45 pb-20 min-h-[33.125rem] lg:min-h-[30.8125rem] lg:pt-24 lg:pb-0">
          {/*
            The photo, extracted from the Figma SVG export — that export
            windows the image for the desktop frame only, so its crop does not
            survive at mobile widths. opacity-30 is the image fill's opacity;
            the layer sits at 100% above it, so 30% is the whole of it.

            Figma's "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0)
            69.88%)" is a mask, not a fill — white shows, clear hides — so the
            photo fades out ~70% down and the bottom is pure background-dark.

            object-position differs per breakpoint because the frames crop the
            photo differently: mobile centres it (the 823.65px-wide placement
            is centred in 375), desktop shows y 14.1-65%, which lands at 29%
            of the cover overflow.
          */}
          <Image
            src="/events/events-header-bg.jpg"
            alt=""
            fill
            sizes="100vw"
            quality={90}
            // The LCP element on this route, so it must not lazy-load. Eager
            // rather than `preload`: a preload link resolves a candidate width
            // in <head> before layout, and with fill + sizes="100vw" that
            // picked w=750 while the image used another, downloading a file it
            // never displayed. The docs recommend eager for this reason.
            loading="eager"
            aria-hidden
            className="pointer-events-none select-none object-cover object-center opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_69.88%)] lg:object-[50%_29%]"
          />

          <Container className="relative">
            <h1 className="text-h1 font-semibold text-foreground-light">
              Berbagai Acara{" "}
              {/*
                Figma breaks after "Acara" on desktop; mobile wraps naturally
                into three lines. The explicit space matters — JSX drops the
                newline around the <br>, so hiding it would run the two
                halves together.
              */}
              <br className="hidden lg:block" />
              Sudah Kami Kerjakan
            </h1>
            <p className="mt-6 text-body-xl font-normal text-foreground-light">
              Pengalaman menangani berbagai jenis acara membuat kami paham
              kebutuhan setiap klien, sehingga hasilnya selalu sesuai harapan.
            </p>
          </Container>
        </section>

        {/* The header carries the page title, so the grid needs no heading. */}
        <Section>
          <Container>
            {events.length === 0 ? (
              <p className="text-body-xl text-foreground-light-secondary">
                Belum ada acara yang dipublikasikan.
              </p>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {events.map((event) => (
                  <li key={event.id}>
                    {/*
                      Cards are static: `events` has no slug field, so there is
                      no per-event route to send anyone to yet.
                    */}
                    <EventCard
                      event={event}
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                      imageAspect="aspect-[5/3]"
                      showMeta
                    />
                  </li>
                ))}
              </ul>
            )}
          </Container>
        </Section>
      </div>

      <SiteFooter />
    </>
  );
}
