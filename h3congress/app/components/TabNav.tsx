"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS: Array<{ href: string; label: string }> = [
  { href: "/", label: "About" },
  { href: "/reform-map", label: "Reform Map" },
  { href: "/domains", label: "Domains" },
  { href: "/system-diagram", label: "System Diagram" }
];

export default function TabNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="h3-nav h3-tab-nav" aria-label="Primary navigation">
      <Link className="h3-brand" href="/">
        <img src="/assets/h3-logo.png" alt="H3 Congress" />
        <span>A Three Horizons Vision for Congress</span>
      </Link>
      <div className="h3-nav-links h3-tab-links">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`h3-tab${isActive(tab.href) ? " is-active" : ""}`}
            aria-current={isActive(tab.href) ? "page" : undefined}
          >
            {tab.label}
          </Link>
        ))}
        <Link
          className={`h3-nav-export${isActive("/export") ? " is-active" : ""}`}
          href="/export"
          aria-current={isActive("/export") ? "page" : undefined}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v12" />
            <path d="M8 7l4-4 4 4" />
            <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
          </svg>
          Export
        </Link>
        <Link
          className={`h3-nav-cta${isActive("/get-involved") ? " is-active" : ""}`}
          href="/get-involved"
        >
          Get involved
        </Link>
      </div>
    </nav>
  );
}
