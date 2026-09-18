"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Container, Logo } from "@/components/ui";
import { cn } from "@/lib/cn";
import { navItems, type NavItem } from "./nav-items";

type NavbarProps = {
  /**
   * `overlay` sits transparently on top of a dark hero (the Figma home page);
   * `solid` gives it its own dark background for pages without one;
   * `light` is the inverse of `solid`, for pages that open on white.
   */
  tone?: "overlay" | "solid" | "light";
};

function Chevron({
  open,
  collapsed = "down",
}: {
  open: boolean;
  /** Which way the chevron points while closed. Mobile uses `right`. */
  collapsed?: "down" | "right";
}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn(
        "transition-transform duration-200",
        open ? "rotate-180" : collapsed === "right" && "-rotate-90"
      )}
    >
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Burger({ open }: { open: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** True when `href` is the current page or an ancestor of it. */
function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar({ tone = "overlay" }: NavbarProps) {
  const pathname = usePathname();
  // Only the light tone flips the foreground; overlay and solid both sit on
  // dark ground and share the light-on-dark treatment.
  const isLight = tone === "light";
  const toneText = isLight ? "text-foreground" : "text-foreground-light";
  const toneOutline = isLight
    ? "focus-visible:outline-foreground"
    : "focus-visible:outline-foreground-light";
  // The CTA has to hold its own against the ground behind it: the light blue
  // reads on the dark hero, but on the light tone's grey bar Figma uses the
  // dark teal instead.
  const ctaVariant = isLight ? "primary" : "secondary";
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close everything when the route changes (adjust state during render
  // rather than in an effect, so no cascading re-render).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  // Click outside and Escape both dismiss the open dropdown.
  useEffect(() => {
    if (!openMenu && !mobileOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenMenu(null);
      setMobileOpen(false);
      // Return focus to whichever trigger was open.
      navRef.current
        ?.querySelector<HTMLButtonElement>('[aria-expanded="true"]')
        ?.focus();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu, mobileOpen]);

  function toggleMenu(label: string) {
    setOpenMenu((current) => (current === label ? null : label));
  }

  return (
    <header
      ref={navRef}
      className={cn(
        "top-0 right-0 left-0 z-50",
        tone === "overlay" && "absolute",
        tone === "solid" && "sticky bg-background-dark",
        isLight && "sticky bg-background-grey"
      )}
    >
      <Container size="lg">
        <nav
          aria-label="Main"
          // Figma frame heights: 66 on mobile, 96 from lg. Both are fixed
          // heights, not hugging their tallest child — the frames' 8px and 12px
          // vertical padding are minimums the centred content clears easily.
          // The 8px gap only bites if the row ever gets too cramped for
          // justify-between to spread it; the 100px side padding is Container
          // size="lg" landing on 1240px of content inside a 1440 frame.
          className="flex h-16.5 items-center justify-between gap-2 py-2 lg:h-24 lg:py-3"
        >
          <Logo
            href="/"
            linkClassName="shrink-0"
            variant={isLight ? "light" : "dark"}
            height={48}
            preload
            className="h-10 w-auto lg:h-12"
          />

          {/* Desktop nav */}
          <ul className="hidden items-center gap-10 lg:flex">
            {navItems.map((item) => (
              <li key={item.label} className="relative">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleMenu(item.label)}
                      aria-expanded={openMenu === item.label}
                      aria-haspopup="menu"
                      aria-controls={`submenu-${item.label}`}
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-1.5 rounded-sm py-2 text-body-xl transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4",
                      toneText,
                      toneOutline,
                        isActive(pathname, item.href) && "font-medium"
                      )}
                    >
                      {item.label}
                      <Chevron open={openMenu === item.label} />
                    </button>
                    <SubMenu
                      item={item}
                      pathname={pathname}
                      open={openMenu === item.label}
                    />
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex rounded-sm py-2 text-body-xl transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4",
                      toneText,
                      toneOutline,
                      isActive(pathname, item.href) && "font-medium"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {/* Wrapped rather than given `hidden`: cn() concatenates without
                resolving Tailwind conflicts, so it loses to Button's inline-flex. */}
            <div className="hidden lg:block">
              {/* One of the two entry points into /contact; the other is the
                  footer's "Hubungi kami". */}
              <Button href="/contact" variant={ctaVariant}>
                Kontak kami
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              className={cn(
                "inline-flex cursor-pointer items-center justify-center rounded-md p-2 focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden",
                toneText,
                toneOutline
              )}
            >
              <Burger open={mobileOpen} />
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile panel */}
      <div id="mobile-menu" hidden={!mobileOpen} className="px-6 pb-4 lg:hidden">
        <div className="menu-in rounded-xl bg-background p-4 shadow-lg ring-1 ring-black/5">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleMenu(item.label)}
                      aria-expanded={openMenu === item.label}
                      aria-controls={`mobile-submenu-${item.label}`}
                      className="flex h-9 w-full cursor-pointer items-center justify-between text-left text-body-xl text-foreground"
                    >
                      {item.label}
                      <Chevron open={openMenu === item.label} collapsed="right" />
                    </button>
                    <ul
                      id={`mobile-submenu-${item.label}`}
                      hidden={openMenu !== item.label}
                      className="flex flex-col pb-2"
                    >
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="flex h-9 items-center pl-4 text-body-lg text-foreground-secondary"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="flex h-9 items-center text-body-xl text-foreground"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-2">
            <Button href="/contact" variant={ctaVariant} className="w-full">
              Kontak kami
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function SubMenu({
  item,
  pathname,
  open,
}: {
  item: NavItem;
  pathname: string;
  open: boolean;
}) {
  return (
    <div
      id={`submenu-${item.label}`}
      role="menu"
      aria-label={item.label}
      hidden={!open}
      className="menu-in absolute top-full left-0 mt-3 w-80 rounded-xl bg-background p-2 shadow-lg ring-1 ring-black/5"
    >
      {item.children?.map((child) => (
        <Link
          key={child.href}
          href={child.href}
          role="menuitem"
          className={cn(
            "block rounded-lg px-4 py-3 text-body-xl text-foreground transition-colors hover:bg-muted",
            isActive(pathname, child.href) && "bg-muted font-medium"
          )}
        >
          {child.label}
        </Link>
      ))}
    </div>
  );
}
