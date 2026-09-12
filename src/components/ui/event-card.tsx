import Image from "next/image";
import Link from "next/link";
import { Badge } from "./badge";
import { CardTitle } from "./card";
import { ImageFrame } from "./image-frame";
import { cn } from "@/lib/cn";
import type { EventSummary } from "@/lib/events";

type EventCardProps = {
  event: EventSummary;
  /**
   * Where the card points. Omit it for a static card: `events` has no slug
   * field, so on the index itself there is nothing to link to.
   */
  href?: string;
  /** next/image `sizes`; the rail and the grid render at different widths. */
  sizes: string;
  /**
   * Aspect-ratio classes for the image well. Replaces the default outright
   * rather than layering over it — cn() has no tailwind-merge, so two
   * competing aspect-* classes would resolve by stylesheet order.
   */
  imageAspect?: string;
  /** Location and duration, when the layout has room for them. */
  showMeta?: boolean;
};

/**
 * One location/duration pair. The icons are 18px and already stroked in
 * grey-80, the colour of the text they sit beside, so they need no recolour —
 * an <img> is enough and the vector never has to be inlined. They carry the
 * meaning of the value next to them, hence the screen-reader-only label.
 */
function Meta({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Image src={icon} alt="" width={18} height={18} className="size-4.5 shrink-0" />
      <span className="sr-only">{label}:</span>
      {children}
    </span>
  );
}

export function EventCard({
  event,
  href,
  sizes,
  imageAspect = "aspect-[7/5] lg:aspect-[5/3]",
  showMeta = false,
}: EventCardProps) {
  const body = (
    <>
      <ImageFrame
        src={event.image}
        alt={event.imageAlt || event.title}
        sizes={sizes}
        className={cn("rounded-lg bg-muted", imageAspect)}
        // Only the linked cards zoom. On the events index they go nowhere,
        // and a hover response with no click behind it promises a page that
        // does not exist.
        imageClassName={
          href
            ? "transition-transform duration-300 group-hover:scale-105"
            : undefined
        }
      />

      {event.category && (
        <div className="mt-6">
          <Badge tone="accent">{event.category}</Badge>
        </div>
      )}
      <CardTitle className="mt-2">{event.title}</CardTitle>

      {showMeta && (event.location || event.duration) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-body-lg text-foreground-secondary">
          {event.location && (
            <Meta icon="/icon/marker-pin.svg" label="Lokasi">
              {event.location}
            </Meta>
          )}
          {event.duration && (
            <Meta icon="/icon/calendar.svg" label="Durasi">
              {event.duration}
            </Meta>
          )}
        </div>
      )}
    </>
  );

  const shell = cn(
    "flex h-full flex-col rounded-xl bg-background p-4 lg:p-6",
    href &&
      "group transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
  );

  if (!href) return <div className={shell}>{body}</div>;

  return (
    <Link href={href} className={shell}>
      {body}
    </Link>
  );
}
