'use client';

import { Link, useConfig } from '@payloadcms/ui';
import { usePathname } from 'next/navigation';
import { formatAdminURL } from 'payload/shared';

/**
 * A "Dashboard" entry at the top of the sidebar.
 *
 * Payload has no such link — the only way back to the dashboard is the logo or
 * the breadcrumb, neither of which reads as navigation. This is rendered
 * through `admin.components.beforeNavLinks`, which puts it above the first
 * group.
 *
 * The markup deliberately mirrors what Payload builds for its own entries: the
 * same classes, the same `nav-` id convention, a plain `div` rather than a link
 * when it is the current page, and the indicator element that the stylesheet
 * keys the active pill off. Copying that shape is what keeps this looking and
 * behaving like the links underneath it rather than an implant.
 */
export function DashboardNavLink() {
  const pathname = usePathname();
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig();

  // The admin route is configurable, so the href is built the same way Payload
  // builds its own rather than hardcoded to "/admin".
  const href = formatAdminURL({ adminRoute, path: '' });
  const isActive = pathname === href || pathname === `${href}/`;

  const label = (
    <>
      {isActive ? <div className="nav__link-indicator" /> : null}
      <span className="nav__link-label">Dashboard</span>
    </>
  );

  if (isActive) {
    return (
      <div className="nav__link" id="nav-dashboard">
        {label}
      </div>
    );
  }

  return (
    <Link className="nav__link" href={href} id="nav-dashboard" prefetch={false}>
      {label}
    </Link>
  );
}
