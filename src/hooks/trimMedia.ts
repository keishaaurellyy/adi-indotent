import type { PayloadRequest } from 'payload';

/**
 * Reduce every populated media doc in a response to { id, url, alt }.
 *
 * `filename` has to stay in Media's `defaultPopulate` because Payload builds
 * `url` from it while reading — dropping it there yields `url: null`. So it is
 * removed here instead, once the URL exists.
 *
 * Trimming is skipped for authenticated requests: the admin panel reads the
 * same endpoints and relies on the full upload document. Only public reads —
 * the website — get the lean shape.
 */

type MediaLike = { alt?: unknown; filename?: unknown; id?: unknown; url?: unknown };

const isPopulatedMedia = (value: unknown): value is MediaLike =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  typeof (value as MediaLike).filename === 'string' &&
  'url' in (value as MediaLike);

const trim = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(trim);

  if (isPopulatedMedia(value)) {
    return { id: value.id, url: value.url, alt: value.alt ?? null };
  }

  if (typeof value === 'object' && value !== null) {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) out[key] = trim(nested);
    return out;
  }

  return value;
};

export const trimMedia = <T>({ doc, req }: { doc: T; req: PayloadRequest }): T =>
  req.user ? doc : (trim(doc) as T);
