export const WHATSAPP_URL = "https://wa.me/6281111805577";

export const WHATSAPP_DISPLAY = "(+62) 81111805577";

/**
 * The same number in E.164, which is the only format schema.org `telephone`
 * is reliably parsed in. WHATSAPP_DISPLAY is punctuated for humans.
 */
export const PHONE_E164 = "+6281111805577";

export const INSTAGRAM_URL = "https://www.instagram.com/adiindotent";

export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61584008922195";

/** The newline is rendered by whitespace-pre-line on the contact card. */
export const OPENING_HOURS = "Senin - Sabtu\n09.00 - 17.00 WIB";

/**
 * The same hours as machine-readable parts, for the LocalBusiness schema.
 * OPENING_HOURS above is not mechanically derivable from these — it carries
 * Indonesian day names, a line break and the timezone label — so the two are
 * kept side by side and must be edited together.
 */
export const OPENING_HOURS_SPEC = {
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  opens: "09:00",
  closes: "17:00",
} as const;

/**
 * The address split into the parts schema.org's PostalAddress expects.
 *
 * Indonesian addressing has one more level than schema.org models, so
 * kelurahan and kecamatan ride along in `streetAddress` and `locality` holds
 * the kabupaten — the granularity Google matches against a Business Profile.
 */
export const POSTAL_ADDRESS = {
  streetAddress: "Jl. Raya Pagedangan No. 7A, Cicalengka, Kec. Pagedangan",
  locality: "Kab. Tangerang",
  region: "Banten",
  postalCode: "15336",
  countryName: "Indonesia",
  /** ISO 3166-1 alpha-2, which is what schema.org `addressCountry` wants. */
  countryCode: "ID",
} as const;

/** The one-line form rendered on the contact card. */
export const ADDRESS = [
  POSTAL_ADDRESS.streetAddress,
  POSTAL_ADDRESS.locality,
  `${POSTAL_ADDRESS.region} ${POSTAL_ADDRESS.postalCode}`,
  POSTAL_ADDRESS.countryName,
].join(", ");

/**
 * Google Maps in an iframe. `output=embed` is the keyless embed endpoint —
 * the Maps Embed API proper wants a billed  API key, and a place search by
 * address needs no key to land on the right pin.
 */
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent("Adi Indotent")}&output=embed`;
