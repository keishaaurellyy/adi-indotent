import {
  Backdrop,
  CARD_GRID,
  Container,
  EventCard,
  Reveal,
  Section,
} from "@/components/ui";
import { Navbar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { getAllEvents } from "@/lib/events";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Events",
  description:
    "Pengalaman menangani berbagai jenis acara membuat kami paham kebutuhan setiap klien, sehingga hasilnya selalu sesuai harapan.",
  path: "/events",
});

/** Same five-minute window as the home rail — both read the same collection. */
export const revalidate = 300;

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <>
      <Navbar />
      <div className="bg-background-dark">
        <section className="relative flex items-center overflow-hidden pt-45 pb-20 min-h-132.5 lg:min-h-123.25 lg:pt-24 lg:pb-0">
          {/* Above the fold, so it loads with the page rather than on scroll. */}
          <Backdrop
            src="/events/events-header-bg.jpg"
            fade="69.88%"
            quality={90}
            loading="eager"
            className="object-center lg:object-[50%_29%]"
          />

          <Container className="relative">
            <h1 className="rise-in text-h1 font-semibold text-foreground-light">
              Berbagai Acara{" "}
              <br className="hidden lg:block" />
              Sudah Kami Kerjakan
            </h1>
            <p className="rise-in mt-6 text-body-xl font-normal text-foreground-light [--rise-delay:100ms]">
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
              <Reveal as="ul" group className={CARD_GRID}>
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
              </Reveal>
            )}
          </Container>
        </Section>
      </div>

      <SiteFooter />
    </>
  );
}
