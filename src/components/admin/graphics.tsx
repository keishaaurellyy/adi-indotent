import Image from 'next/image';

import logoDark from '@/assets/logo-dark.png';
import logoLight from '@/assets/logo-light.png';
import markDark from '@/assets/logo-mark-dark.png';
import markLight from '@/assets/logo-mark-light.png';

/*
 * Branding for the admin panel: `Logo` sits above the login form, `Icon` in
 * the nav header.
 *
 * Both variants are rendered and one is hidden in CSS (see custom.scss) rather
 * than picking one here. The admin theme is a class on <html> that the user can
 * flip at runtime from the account menu, so a server component cannot know
 * which variant to send, and reading it on the client would flash the wrong
 * logo on first paint.
 *
 * Tailwind is not loaded under /admin — only Payload's own stylesheet and
 * custom.scss are — so the sizing here is inline and the theme switch is a
 * plain class.
 */

type Variant = { className: string };

/** The full logo — tent mark above the "adi indotent" wordmark. */
export function Logo() {
  return (
    <span className="brand-logo">
      <BrandImage src={logoLight} className="brand-logo__light" />
      <BrandImage src={logoDark} className="brand-logo__dark" />
    </span>
  );
}

/**
 * The tent mark alone. The nav slot is roughly square, where the full logo
 * would shrink the wordmark past reading size.
 */
export function Icon() {
  return (
    <span className="brand-icon">
      <BrandImage src={markLight} className="brand-logo__light" />
      <BrandImage src={markDark} className="brand-logo__dark" />
    </span>
  );
}

function BrandImage({ src, className }: Variant & { src: typeof logoLight }) {
  return (
    <Image
      src={src}
      alt="Adi Indotent"
      className={className}
      // Static imports carry the intrinsic size; the wrapper's width drives the
      // rendered size and `height: auto` keeps the mark from being stretched.
      style={{ width: '100%', height: 'auto' }}
      // Behind a login, and the only image on the page — worth having it ready
      // before paint rather than lazily.
      preload
    />
  );
}
