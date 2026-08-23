// Server-only by construction: importing `payload` or the config from a
// client component fails the build, so no "server-only" guard is needed.
import config from "@payload-config";
import { getPayload } from "payload";
import type { Event, Media } from "@/payload-types";
import type { HandledEvent } from "@/components/sections/handled-events";

/**
 * Human labels for `event_category`. The stored values are lowercase enum
 * slugs; the design shows a capitalised chip.
 */
const categoryLabels: Record<NonNullable<Event["event_category"]>, string> = {
  korporat: "Korporat",
  pemerintahan: "Pemerintahan",
  keagamaan: "Keagamaan",
  pendidikan: "Pendidikan",
  festival: "Festival",
  komersial: "Komersial",
  gathering: "Gathering",
};

/** How many cards the home rail shows before "Lihat semua" takes over. */
const HOME_EVENT_LIMIT = 8;

/** `image` is a relation, so it arrives as an id until Payload populates it. */
function isPopulated(image: Event["image"]): image is Media {
  return typeof image === "object" && image !== null;
}

function toHandledEvent(event: Event): HandledEvent {
  const image = isPopulated(event.image) ? event.image : null;
  return {
    id: event.id,
    title: event.name,
    category: event.event_category ? categoryLabels[event.event_category] : null,
    image: image?.url ?? null,
    imageAlt: image?.alt ?? "",
  };
}

/**
 * Published events for the home page rail, in the order editors set in the
 * admin.
 *
 * Reads through Payload's Local API rather than fetching /api/events over
 * HTTP: the CMS runs inside this app, so a request to our own route would add
 * a network hop and need an absolute URL that differs per environment.
 *
 * A CMS outage degrades to an empty rail instead of taking down the whole
 * page — the section still renders its heading and its link to /events.
 */
export async function getHomeEvents(): Promise<HandledEvent[]> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "events",
      // Local API calls bypass access control, so drafts have to be excluded
      // explicitly or unpublished events leak onto the site.
      where: { _status: { equals: "published" } },
      sort: "display_order",
      limit: HOME_EVENT_LIMIT,
      // Enough to populate `image`; the Media collection's defaultPopulate
      // trims that to alt/filename/url.
      depth: 1,
    });

    return docs.map(toHandledEvent);
  } catch (error) {
    console.error("[home] could not load events from Payload:", error);
    return [];
  }
}
