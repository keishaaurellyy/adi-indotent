/**
 * Navigation model. Sub-menu labels mirror the Strapi content types
 * (roder, sarnafil, flooring, peralatan-pendukung).
 */
export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "Roder", href: "/products/roder" },
      { label: "Sarnafil", href: "/products/sarnafil" },
      { label: "Flooring", href: "/products/flooring" },
      { label: "Peralatan pendukung", href: "/products/peralatan-pendukung" },
    ],
  },
  { label: "Events", href: "/events" },
];
