"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function H3SimpleHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <nav className="h3-nav h3-simple-nav" aria-label="Primary navigation">
      <Link className="h3-brand" href="/">
        <img src="/assets/h3-logo.png" alt="H3 Congress" />
        <span>A Three Horizons Vision for Congress</span>
      </Link>
      <button
        type="button"
        className={`h3-menu-toggle${menuOpen ? " is-open" : ""}`}
        aria-expanded={menuOpen}
        aria-controls="simple-primary-navigation"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>
      <div
        id="simple-primary-navigation"
        className={`h3-nav-links${menuOpen ? " is-open" : ""}`}
      >
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <span aria-hidden="true">←</span> Back to Overview
        </Link>
        <Link href="/reform-map" onClick={() => setMenuOpen(false)}>
          Reform Map
        </Link>
        <Link
          className="h3-nav-cta"
          href="/get-involved"
          onClick={() => setMenuOpen(false)}
        >
          Get Involved
        </Link>
      </div>
    </nav>
  );
}
