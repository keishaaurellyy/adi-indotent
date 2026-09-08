/**
 * The card grid the category sections share: one column on phones, two from
 * `sm`, three from `lg`.
 *
 * Paired with the `sizes` string that describes it, because the two only stay
 * correct together — a column count changed in one and not the other makes
 * Next fetch the wrong image width silently.
 */
export const CARD_GRID = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8";

export const CARD_GRID_SIZES =
  "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";
