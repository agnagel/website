"use client";

import { useEffect, useState, type ReactNode } from "react";

// Anchors for the right-side rail. Ids match the <section>s in AboutTab; each
// carries a small glyph so the rail can stay icon-only, with the label revealed
// on hover.
type Section = { id: string; label: string; icon: ReactNode };

const SECTIONS: Section[] = [
  {
    id: "hero",
    label: "Top",
    // Capitol dome
    icon: (
      <>
        <path d="M12 2.5v2" />
        <path d="M8 11q4-6 8 0" />
        <path d="M6.5 11h11" />
        <path d="M8 11v6M12 11v6M16 11v6" />
        <path d="M5 20.5h14" />
      </>
    )
  },
  {
    id: "intro",
    label: "Overview",
    // folded map — "a map of the capacity gap"
    icon: (
      <>
        <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
        <path d="M9 4v14M15 6v14" />
      </>
    )
  },
  {
    id: "gap",
    label: "The gap",
    // two lines rising from a shared origin and diverging — the widening gap
    icon: (
      <>
        <path d="M3 19C9 15 15 9 21 5" />
        <path d="M3 19c6 -1.3 12 -2.6 18 -4" />
      </>
    )
  },
  {
    id: "horizons",
    label: "Horizons",
    // sun over the horizon
    icon: (
      <>
        <circle cx="12" cy="13" r="3.5" />
        <path d="M3 20h18M12 4v2M5.5 8l1.3 1.3M18.5 8l-1.3 1.3" />
      </>
    )
  },
  {
    id: "pahlka",
    label: "Perspective",
    // quotation marks
    icon: (
      <>
        <path d="M6 8h4v5a3 3 0 0 1-3 3" />
        <path d="M14 8h4v5a3 3 0 0 1-3 3" />
      </>
    )
  },
  {
    id: "explore",
    label: "Explore",
    // compass
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15.5 8.5 11 11l-2.5 4.5L13 13z" />
      </>
    )
  },
  {
    id: "methodology",
    label: "Methodology",
    // flask — "how this was built"
    icon: (
      <>
        <path d="M9 3h6M10 3v6l-4.5 8a1 1 0 0 0 .9 1.5h11.2a1 1 0 0 0 .9-1.5L14 9V3" />
        <path d="M7.5 15h9" />
      </>
    )
  }
];

// A slim icon rail pinned to the right edge. It highlights the section crossing
// the viewport's middle and smooth-scrolls on click. Labels appear on hover.
// Hidden on narrow screens (see CSS) so it never overlaps the reading column.
export function AboutSideNav() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const sections = SECTIONS.map((section) =>
      document.getElementById(section.id)
    ).filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    event.preventDefault();
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <nav className="h3-about-nav" aria-label="On this page">
      <ul>
        {SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={isActive ? "is-active" : ""}
                aria-label={section.label}
                aria-current={isActive ? "true" : undefined}
                onClick={(event) => handleClick(event, section.id)}
              >
                <svg
                  className="h3-about-nav-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {section.icon}
                </svg>
                <span className="h3-about-nav-label">{section.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
