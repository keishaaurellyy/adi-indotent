import Image from "next/image";
import Link from "next/link";
import { Button, Container, Logo } from "@/components/ui";
import { FACEBOOK_URL, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/contact";
import { navItems } from "./nav-items";

type FooterLink = { label: string; href: string };

/** Mirrors the Products sub-menu so the two never drift apart. */
const productLinks: FooterLink[] =
  navItems.find((item) => item.label === "Products")?.children ?? [];

const socialLinks: FooterLink[] = [
  { label: "Instagram", href: INSTAGRAM_URL },
  { label: "Facebook", href: FACEBOOK_URL },
];

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      {/* Figma: the column is a 151.5x144 stack with a uniform 12px gap. */}
      <h3 className="text-body-lg font-semibold">{title}</h3>
      {/*
        The size lives on the list, not just the anchor: an inline <a> leaves
        the <li> line box sized by the inherited 16px body font, which makes
        every row 24px instead of the 21px that 14px at 150% should give.
      */}
      <ul className="mt-3 flex flex-col gap-3 text-body-lg">
        {links.map((link) => {
          // Social links leave the site, so they open in a new tab. rel guards
          // the opener against tabnabbing.
          const external = link.href.startsWith("http");
          return (
            <li key={link.label}>
              <Link
                href={link.href}
                {...(external && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
                className="text-foreground-secondary transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  // Figma leaves ~96px of white above the card. Without it the card's grey
  // runs straight into the grey section above and the two read as one block.
  return (
    <footer className="pt-16 pb-10 lg:pt-24">
      <Container size="lg">
        {/*
          Figma: a 1240x386 card, which is exactly the container's content
          width — footer-bg.svg is drawn at that size.
        */}
        <div className="relative isolate flex items-center justify-center overflow-hidden rounded-xl bg-background-grey px-4 py-12 text-center lg:min-h-96.5 lg:px-6 lg:py-10">
          <Image
            src="/footer-bg.svg"
            alt=""
            fill
            aria-hidden
            className="pointer-events-none -z-10 select-none object-cover"
          />
          <div className="mx-auto max-w-160">
            {/* Figma: Font/size/xl, Semibold 600, 120%, centred, capitalize. */}
            <h2 className="text-h2 font-semibold capitalize lg:text-balance">
              Konsultasikan Kebutuhan Tenda Anda
            </h2>
            <p className="mt-6 text-body-lg text-foreground-secondary">
              Tim kami siap membantu menentukan jenis dan ukuran tenda yang
              paling sesuai dengan kebutuhan acara anda.
            </p>
            <div className="mt-8">
              <Button
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                Hubungi kami
              </Button>
            </div>
          </div>
        </div>

        {/*
          Mobile (Figma 193-2070): the logo block spans the full 327px content
          width and the two link columns sit side by side beneath it. From lg
          the three become one row.
        */}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:gap-x-24 lg:gap-y-0">
          <div className="col-span-2 max-w-92 lg:col-span-1">
            <Link href="/" aria-label="Adi Indotent — home" className="inline-flex">
              <Logo height={56} className="h-14 w-auto" />
            </Link>
            <p className="mt-4 text-body-lg text-foreground-secondary">
              Solusi sewa tenda terpercaya untuk berbagai acara pernikahan,
              seminar, hingga bazar.
            </p>
          </div>

          <LinkColumn title="Produk" links={productLinks} />
          <LinkColumn title="Sosial Media" links={socialLinks} />
        </div>

        {/* Figma: a hairline rule separates the link columns from the
            copyright on both breakpoints; mobile stacks and centres the two
            lines instead of pushing them to opposite ends. */}
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-border pt-8 text-center text-body-lg text-foreground-secondary sm:mt-10 sm:flex-row sm:justify-between sm:gap-2 sm:pt-10 sm:text-left">
          {/*
            Derived, not hardcoded: the pages that render this footer are
            statically prerendered with revalidate, so the year is re-evaluated
            on rebuild rather than going stale at the turn of the year.
          */}
          <p>Copyright {new Date().getFullYear()} &copy; Adi Indotent</p>
          <p>All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
