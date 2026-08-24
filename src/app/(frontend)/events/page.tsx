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
      <Navbar />
      <div className="bg-background-dark">
        <section className="relative flex items-center overflow-hidden pt-45 pb-20 min-h-132.5 lg:min-h-123.25 lg:pt-24 lg:pb-0">
          <Image
            src="/events/events-header-bg.jpg"
            alt=""
            fill
            sizes="100vw"
            quality={90}
            loading="eager"
            aria-hidden
            className="pointer-events-none select-none object-cover object-center opacity-30 mask-[linear-gradient(to_bottom,black,transparent_69.88%)] lg:object-[50%_29%]"
          />

          <Container className="relative">
            <h1 className="text-h1 font-semibold text-foreground-light">
              Berbagai Acara{" "}
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
