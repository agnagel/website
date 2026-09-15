"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TABS: Array<{ href: string; label: string }> = [
  { href: "/about", label: "About" },
  { href: "/reform-map", label: "Reform Map" },
  { href: "/domains", label: "Domains" },
  { href: "/system-diagram", label: "System Diagram" },
  { href: "/modbot", label: "Modbot" }
];

export default function TabNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="h3-nav h3-tab-nav" aria-label="Primary navigation">
      <Link className="h3-brand" href="/">
        <img src="/assets/h3-logo.png" alt="H3 Congress" />
        <span>A Three Horizons Vision for Congress</span>
      </Link>
      <button
        type="button"
        className={`h3-menu-toggle${menuOpen ? " is-open" : ""}`}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>
      <div
        id="primary-navigation"
        className={`h3-nav-links h3-tab-links${menuOpen ? " is-open" : ""}`}
      >
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
          Get Involved
        </Link>
      </div>
    </nav>
  );
}
