// Server-only by construction: importing `payload` or the config from a
// client component fails the build, so no "server-only" guard is needed.
import config from "@payload-config";
import { getPayload } from "payload";
import type { Event, Media } from "@/payload-types";

/** An event document flattened down to what the UI actually renders. */
export type EventSummary = {
  id: number;
  title: string;
  /** Display label, not the stored enum slug. Null when the editor left it blank. */
  category?: string | null;
  location?: string | null;
  duration?: string | null;
  /** Absolute R2 URL, or a /api/media/file/... path when R2 is not configured. */
  image?: string | null;
  imageAlt?: string;
};

/**
 * Human labels for `event_category`. The stored values are lowercase enum
 * slugs; the design shows a capitalised chip.
 */
const categoryLabels: Record<NonNullable<Event["event_category"]>, string> = {
  korporat: "Korporat",
  pemerintahan: "Pemerintahan",
  keagamaan: "Keagamaan",
  festival: "Festival",
  bazaar: "Bazaar",
  wedding: "Wedding",
  komunitas: "Komunitas",
};

/** How many cards the home rail shows before "Lihat semua" takes over. */
const HOME_EVENT_LIMIT = 8;

/**
 * Payload caps `limit` at 10 by default and paginates the rest. The index
 * shows everything at once, so ask for one large page instead.
 */
const ALL_EVENTS_LIMIT = 500;

/** `image` is a relation, so it arrives as an id until Payload populates it. */
function isPopulated(image: Event["image"]): image is Media {
  return typeof image === "object" && image !== null;
}

function toEventSummary(event: Event): EventSummary {
  const image = isPopulated(event.image) ? event.image : null;
  return {
    id: event.id,
    title: event.name,
    category: event.event_category ? categoryLabels[event.event_category] : null,
    location: event.location,
    duration: event.duration,
    image: image?.url ?? null,
    imageAlt: image?.alt ?? "",
  };
}

/**
 * Published events in the order editors set in the admin.
 *
 * Reads through Payload's Local API rather than fetching /api/events over
 * HTTP: the CMS runs inside this app, so a request to our own route would add
 * a network hop and need an absolute URL that differs per environment.
 *
 * A CMS outage degrades to an empty list instead of taking down the whole
 * page — callers still render their headings and surrounding chrome.
 */
async function findPublishedEvents(limit: number): Promise<EventSummary[]> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "events",
      // Local API calls bypass access control, so drafts have to be excluded
      // explicitly or unpublished events leak onto the site.
      where: { _status: { equals: "published" } },
      sort: "display_order",
      limit,
      // Enough to populate `image`; the Media collection's defaultPopulate
      // trims that to alt/filename/url.
      depth: 1,
    });

    return docs.map(toEventSummary);
  } catch (error) {
    console.error("[events] could not load events from Payload:", error);
    return [];
  }
}

/** The first few events, for the rail on the home page. */
export function getHomeEvents(): Promise<EventSummary[]> {
  return findPublishedEvents(HOME_EVENT_LIMIT);
}

/** Every published event, for the /events index. */
export function getAllEvents(): Promise<EventSummary[]> {
  return findPublishedEvents(ALL_EVENTS_LIMIT);
}
