"use client";

import type { ReactNode } from "react";
import { useReveal } from "../useReveal";

// Left column of each About section: number, glyph, eyebrow, heading. The glyph
// paths are passed as children (same small line-icon style as the Domains cards
// and the Three Horizons side-rail).
function AboutHead({
  label,
  title,
  children
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="h3-methodology-head" data-reveal>
      <svg
        className="h3-about-glyph"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
      <p className="h3-eyebrow">{label}</p>
      <h2 className="h3-statement">{title}</h2>
    </div>
  );
}

export default function AboutPageTab() {
  useReveal();

  return (
    <>
      <section id="methodology" className="h3-section h3-methodology tex-grid-fine">
        <div className="h3-container h3-about-grid">
          <AboutHead label="Methodology" title="How this was built">
            <path d="M9 3h6M10 3v6l-4.5 8a1 1 0 0 0 .9 1.5h11.2a1 1 0 0 0 .9-1.5L14 9V3" />
            <path d="M7.5 15h9" />
          </AboutHead>
          <div className="h3-methodology-body" data-reveal>
            <p>
              This map was built on an extensive base of research: a wide review
              of existing literature on Congress and its capacity, alongside more
              than fifty candid interviews with people who know the
              institution well.
            </p>
            <p>
              The people we spoke with span the community that shapes how Congress
              works: current and former congressional staff across personal
              offices and committees; legislative-branch support
              offices; good-governance organizations;
              academic researchers; civic-technologists; and government-relations
              professionals.
            </p>
            <p>
              Because the volume of material was large, AI was used as a research
              and synthesis aid — to search across sources, research, and
              interview notes; to summarize long documents; and to
              consolidate overlapping or redundant ideas so the map does not double-count proposals. Every classification,
              and every decision about what to include or leave out, remains a
              human editorial judgment. The website itself was generated with the assistance
              of Claude Code.
            </p>
            <p>
              This is a living project. We will continue to gather and refine ideas for some time to come.
            </p>
          </div>
        </div>
      </section>

      <section id="popvox" className="h3-section h3-methodology">
        <div className="h3-container h3-about-grid">
          <AboutHead label="About" title="POPVOX Foundation">
            <path d="M4 21h16" />
            <path d="M6 21V9m4 12V9m4 12V9m4 12V9" />
            <path d="M3.5 9 12 4l8.5 5" />
          </AboutHead>
          <div className="h3-methodology-body" data-reveal>
            <p>
              This project is a product of{" "}
              <a
                href="https://www.popvox.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                POPVOX Foundation
              </a>
              , a nonpartisan nonprofit passionate about supporting the U.S.
              Congress as it tackles the pacing problem.
            </p>
            <p>
              The Foundation works with legislative bodies — the U.S. Congress,
              state legislatures, and parliaments around the world — on
              responsible AI adoption, tech literacy, and software prototyping,
              helping democratic institutions strengthen their ability to govern in a fast-changing world.
            </p>
          </div>
        </div>
      </section>

      <section id="recoding-america" className="h3-section h3-methodology tex-grid-dense">
        <div className="h3-container h3-about-grid">
          <AboutHead label="About" title="Recoding America">
            <path d="M9 8 5 12l4 4" />
            <path d="M15 8l4 4-4 4" />
          </AboutHead>
          <div className="h3-methodology-body" data-reveal>
            <p>
              <a
                href="https://recodingamerica.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Recoding America
              </a>{" "}
              is a cross-ideological initiative working to transform how American
              government operates at a fundamental level — moving from an
              industrial-era operating model to one suited for modern challenges,
              so that government can reliably deliver outcomes to the American public.
            </p>
            <p>
              Acting as a field catalyst, it convenes diverse stakeholders across
              political lines and supports reforms in how government hires
              talent, procures goods and services, builds systems, and learns from
              experience, at both the federal and state levels.
            </p>
          </div>
        </div>
      </section>

      <section id="author" className="h3-section h3-methodology tex-dots">
        <div className="h3-container h3-about-grid">
          <AboutHead label="About" title="The author">
            <circle cx="12" cy="8" r="3.2" />
            <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
          </AboutHead>
          <div className="h3-methodology-body" data-reveal>
            <p>
              <a
                href="https://www.popvox.org/blog/welcome-ashley-nagel"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ashley Nagel
              </a>{" "}
              is Senior Manager for Government Innovation at POPVOX Foundation,
              where she leads the organization&rsquo;s congressional engagement
              strategy.
            </p>
            <p>
              She previously served as a Senate legislative fellow focused on AI
              policy and government modernization. Before entering public service,
              she was a senior software automation engineer at Apple. Ashley holds a B.S. and M.S. in
              Electrical Engineering from Columbia University.
            </p>
          </div>
        </div>
      </section>

      <section id="acknowledgments" className="h3-section h3-methodology">
        <div className="h3-container h3-about-grid">
          <AboutHead label="Acknowledgments" title="With thanks">
            <path d="M12 20s-6.5-4.2-6.5-9A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 6.5 2c0 4.8-6.5 10-6.5 10z" />
          </AboutHead>
          <div className="h3-methodology-body" data-reveal>
            <p>
              Our sincere thanks to everyone who gave their time to be
              interviewed. This work would not exist without your candor and
              insight. We are also grateful to Recoding America for their support
              of this project.
            </p>
            <p>
              Ashley would like to especially thank and acknowledge her
              colleagues, Caitlin McNally, Aubrey Wilson, and Marci Harris, for
              their contributions and encouragement.
            </p>
            <p>
              &lt;3
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
