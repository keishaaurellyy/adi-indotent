/**
 * The card grid used across the site: one column on phones, two from `sm`,
 * three from `lg`. Shared by the category sections, the events index and the
 * home page's card rows.
 *
 * Paired with the `sizes` string that describes it, because the two only stay
 * correct together — a column count changed in one and not the other makes
 * Next fetch the wrong image width silently. A caller that knows its columns
 * resolve to a fixed pixel width may pass something more precise instead.
 */
export const CARD_GRID = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8";

export const CARD_GRID_SIZES =
  "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";
