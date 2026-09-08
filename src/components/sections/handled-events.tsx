import { Backdrop, Button, Container, EventCard } from "@/components/ui";
import type { EventSummary } from "@/lib/events";

type HandledEventsProps = {
  title?: string;
  description?: string;
  ctaHref?: string;
  events: EventSummary[];
};

/*
 * The card rail bleeds off the right edge of the viewport, so it can't live
 * inside <Container>. Instead the first card is padded to wherever the
 * container's content edge would fall: the gutter on narrow screens, and the
 * centred offset once the viewport is wider than the container. Uses 100%
 * rather than 100vw so a visible scrollbar doesn't skew the alignment.
 */
const railInset =
  "pl-[max(1.5rem,calc((100%-81.5rem)/2+2rem))] pr-6 " +
  "lg:pl-[max(2rem,calc((100%-81.5rem)/2+2rem))] lg:pr-8";

export function HandledEvents({
  title = "Acara yang Pernah Kami Tangani",
  description = "Mulai dari pernikahan, acara perusahaan, hingga kegiatan komunitas, kami siap membantu mewujudkannya.",
  ctaHref = "/events",
  events,
}: HandledEventsProps) {
  return (
    <section className="relative overflow-hidden bg-background-dark py-16 lg:py-24">
      {/* Figma fades the photo out at 70% of the section's height. */}
      <Backdrop src="/bg-section-4.jpg" />

      <div className="relative">
        <Container size="lg">
          {/* Figma: heading left, a ~432px block right — not a 50/50 split. */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_27rem] lg:items-start lg:gap-12">
            <h2 className="text-h2 font-semibold text-foreground-light lg:max-w-[27rem]">
              {title}
            </h2>
            <div>
              {/* 16px/150% at both breakpoints; body-lg would drop to 14px on mobile. */}
              <p className="text-base/[1.5] text-foreground-light-secondary">
                {description}
              </p>
              <div className="mt-6">
                <Button href={ctaHref} variant="secondary" className="w-full sm:w-auto">
                  Lihat semua
                </Button>
              </div>
            </div>
          </div>
        </Container>

        <div className={`no-scrollbar mt-10 overflow-x-auto lg:mt-16 ${railInset}`}>
          <ul className="flex snap-x snap-mandatory gap-6 lg:gap-8">
            {events.map((event) => (
              <li
                key={event.id}
                className="w-[19.5rem] shrink-0 snap-start lg:w-[29.875rem]"
              >
                {/*
                  Every card points at the index: `events` has no slug field,
                  so there is nothing to build a per-event route from yet.
                */}
                <EventCard
                  event={event}
                  href={ctaHref}
                  sizes="(min-width: 1024px) 430px, 280px"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
