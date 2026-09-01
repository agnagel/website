"use client";

import Link from "next/link";
import { useReveal } from "../useReveal";
import { useHeroScroll } from "../useHeroScroll";

const exploreLinks = [
  {
    href: "/reform-map",
    title: "Reform Map",
    art: "map",
    body:
      "See how individual reform efforts sort into pressure relief (H2−) and capacity building (H2+)."
  },
  {
    href: "/domains",
    title: "Domains",
    art: "domains",
    body:
      "Explore the high-level domains where congressional capacity could get built."
  },
  {
    href: "/system-diagram",
    title: "System Diagram",
    art: "diagram",
    body:
      "View Congress as an information system, mapped across the legislative cycle."
  }
];

// Small, on-brand line illustrations for each "Keep exploring" card.
function ExploreArt({ kind }: { kind: string }) {
  if (kind === "map") {
    return (
      <svg className="h3-explore-art" viewBox="0 0 76 44" fill="none" aria-hidden="true">
        <line x1="6" y1="9" x2="70" y2="9" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" strokeLinecap="round" opacity="0.4" />
        <line x1="6" y1="35" x2="70" y2="35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
        <circle cx="15" cy="30" r="4" fill="#8fa2ba" />
        <circle cx="31" cy="21" r="4" fill="var(--h2neg)" />
        <circle cx="47" cy="16" r="4" fill="var(--h2pos)" />
        <circle cx="63" cy="10" r="4.5" fill="var(--h3)" />
      </svg>
    );
  }
  if (kind === "domains") {
    return (
      <svg className="h3-explore-art" viewBox="0 0 76 44" fill="none" aria-hidden="true">
        <rect x="6" y="6" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
        <rect x="30" y="6" width="20" height="14" rx="3" fill="var(--h3)" opacity="0.9" />
        <rect x="54" y="6" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
        <rect x="6" y="24" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
        <rect x="26" y="24" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
        <rect x="50" y="24" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
      </svg>
    );
  }
  // diagram: input → institution → output
  return (
    <svg className="h3-explore-art" viewBox="0 0 76 44" fill="none" aria-hidden="true">
      <line x1="20" y1="22" x2="30" y2="22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
      <line x1="48" y1="22" x2="58" y2="22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
      <circle cx="13" cy="22" r="7" stroke="var(--h3)" strokeWidth="1.8" />
      <rect x="30" y="13" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.8" opacity="0.8" />
      <circle cx="65" cy="22" r="7" fill="var(--h2pos)" opacity="0.9" />
    </svg>
  );
}

const horizonPanels = [
  {
    tag: "H1 - THE SYSTEM TODAY",
    title: "The inherited operating model.",
    body:
      "Congress relies on staffing models, support institutions, information systems, and technology built for an earlier era. The system still functions, but it does not give Members and staff the visibility, expertise, or feedback they need for the decade ahead.",
    color: "var(--h1)"
  },
  {
    tag: "H2- - PRESSURE RELIEF",
    title: "Reform that helps H1 survive.",
    body:
      "Some reforms reduce pain without changing the conditions that produce it. They may help an office, committee, or support agency cope. But if they leave the underlying operating model intact, they can make deeper change less likely.",
    color: "var(--h2neg)"
  },
  {
    tag: "H2+ - CAPACITY SHIFT",
    title: "Reform that builds toward H3.",
    body:
      "Other reforms change the conditions under which Congress works. They build standing expertise, shared infrastructure, better information flows, institutional memory, and feedback loops that let Congress learn from implementation.",
    color: "var(--h2pos)"
  },
  {
    tag: "H3 - THE FUTURE CONGRESS",
    title: "A Congress that can learn in time.",
    body:
      "H3 is not the current institution working harder. It is a Congress with the capacity to see problems earlier, test policy before failure becomes visible, learn from implementation, oversee complex systems, and adapt without surrendering its constitutional role. You build the path through H2+.",
    color: "var(--h3)"
  }
];

export default function AboutTab() {
  useReveal();
  useHeroScroll();

  return (
    <>
      <div id="h3-progress" aria-hidden="true" />

      <header id="hero" className="h3-hero">
        <svg
          className="h3-hero-bg"
          viewBox="0 0 1440 600"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="h3-herosky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--paper)" />
              <stop offset="1" stopColor="var(--paper-2)" />
            </linearGradient>
          </defs>
          <rect width="1440" height="600" fill="url(#h3-herosky)" />
          <g stroke="var(--line)" strokeWidth="1" fill="none" opacity="0.8">
            <path d="M0,470 C 360,455 1080,455 1440,470" />
            <path d="M0,510 C 360,498 1080,498 1440,510" />
            <path d="M0,552 C 360,544 1080,544 1440,552" />
          </g>
          <g id="h3-hero-sun" transform="translate(0,70)">
            <circle cx="1150" cy="338" r="100" fill="var(--h3-glow)" opacity="0.6" />
            <circle cx="1150" cy="338" r="56" fill="#fff2cf" opacity="0.78" />
          </g>
        </svg>

        <img
          className="h3-motif h3-motif-pencil"
          src="/assets/us_capitol_pencil_sketch.svg"
          alt=""
          aria-hidden="true"
        />

        <div id="h3-hero-inner" className="h3-hero-inner">
          <p className="h3-eyebrow h3-eyebrow-accent">Public draft · Input invited</p>
          <h1>Congress needs a longer horizon.</h1>
          <p className="h3-hero-copy">
            The demands on Congress are accelerating. Its capacity to legislate, oversee,
            learn, and adapt is not. The Three Horizons framework helps map the distance:
            Horizon 1 is the current path, Horizon 2 is the field of changes underway now,
            and Horizon 3 is the future Congress that becomes possible.
          </p>
          <p className="h3-launch-note h3-hero-copy">
            The key distinction is inside Horizon 2: H2- efforts can provide near-term relief
            while leaving growth constrained; H2+ efforts become stepping stones toward deeper
            transformation. Use this site to help identify what Congress must build next.
          </p>
        </div>
      </header>

      <section id="intro" className="h3-section h3-intro">
        <div className="h3-container h3-intro-grid">
          <div data-reveal>
            <p className="h3-eyebrow">What this is</p>
            <p className="h3-statement">A map of the capacity gap in Congress.</p>
          </div>
          <div className="h3-two-col" data-reveal>
            <p>
              Congress is being asked to govern faster, more technical, more interconnected
              systems. This project asks whether the legislative branch has the staffing,
              institutions, information flows, technology, and feedback loops to meet that
              challenge.
            </p>
            <p>
              The goal is not to advocate for every reform idea. The goal is to distinguish between
              reforms that make today&apos;s system easier to survive and reforms that build the
              conditions for a stronger Congress. That distinction is the difference between H2-
              and H2+.
            </p>
          </div>
        </div>
      </section>

      <section id="gap" className="h3-gap">
        <div className="h3-pinned h3-gap-pinned">
          <div className="h3-container">
            <p className="h3-eyebrow h3-eyebrow-gold">The pacing problem</p>
            <h2>The pace of change has outrun the institution.</h2>
            <div className="h3-chart-wrap">
              <svg
                className="h3-gap-chart"
                viewBox="0 0 1060 300"
                preserveAspectRatio="xMidYMid meet"
                aria-label="Line chart showing the pace of change rising faster than Congress's capacity"
              >
                <g stroke="color-mix(in srgb, var(--paper) 16%, transparent)" strokeWidth="1">
                  <line x1="80" y1="20" x2="80" y2="260" />
                  <line x1="80" y1="260" x2="980" y2="260" />
                </g>
                <text x="80" y="280" fill="color-mix(in srgb, var(--paper) 60%, transparent)">
                  now
                </text>
                <text
                  x="980"
                  y="280"
                  textAnchor="end"
                  fill="color-mix(in srgb, var(--paper) 60%, transparent)"
                >
                  the decade ahead →
                </text>
                <path
                  id="h3-gap-fill"
                  d="M 80 217 C 360 215, 600 193, 760 128 C 880 77, 945 38, 980 22 L 980 225 C 945 221, 880 217, 760 213 C 600 209, 360 211, 80 217 Z"
                  fill="#8fe6ff"
                  opacity="0"
                />
                <path
                  id="h3-cap-path"
                  d="M 80 217 C 360 220, 600 217, 760 213 C 880 211, 945 222, 980 225"
                  fill="none"
                  stroke="#f4c430"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  id="h3-tech-path"
                  d="M 80 217 C 360 215, 600 193, 760 128 C 880 77, 945 38, 980 22"
                  fill="none"
                  stroke="var(--h3)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <g id="h3-gap-label" opacity="0">
                  <line x1="1000" y1="22" x2="1000" y2="225" stroke="#8fe6ff" strokeWidth="1.5" />
                  <line x1="994" y1="22" x2="1006" y2="22" stroke="#8fe6ff" strokeWidth="1.5" />
                  <line x1="994" y1="225" x2="1006" y2="225" stroke="#8fe6ff" strokeWidth="1.5" />
                </g>
                <text x="690" y="88" fill="var(--h3)" className="h3-chart-label">
                  The pace of change
                </text>
                <text
                  x="690"
                  y="244"
                  fill="color-mix(in srgb, var(--paper) 80%, transparent)"
                  className="h3-chart-label"
                >
                  Congress&apos;s capacity
                </text>
              </svg>
              <div id="h3-gap-caption">THE GAP - AND IT&apos;S WIDENING</div>
            </div>
            <p className="h3-gap-copy">
              AI, policy complexity, constituent expectations, and the sophistication of the
              actors Congress must oversee are accelerating. Congress&apos;s capacity to legislate,
              oversee, and respond has not kept pace.
            </p>
          </div>
        </div>
      </section>

      <section className="h3-risk">
        <div className="h3-container" data-reveal>
          <p>
            A legislature built for a slower information environment cannot govern modern
            systems by working harder alone. It needs new capacity, better feedback, stronger
            support institutions, and a <span>longer horizon</span>.
          </p>
        </div>
      </section>

      <section id="horizons" className="h3-horizons">
        <div className="h3-pinned h3-horizons-pinned">
          <div className="h3-reveal" aria-hidden="true">
            <div className="h3-reveal-circuit">
              <img src="/assets/us_capitol_neon_circuit.svg" alt="" />
              <div className="h3-beacon">
                <span />
                <span />
                <span />
                <span />
                <span />
                <i />
              </div>
            </div>
            <div className="h3-reveal-pencil" id="h3-reveal-pencil">
              <img src="/assets/us_capitol_pencil_sketch.svg" alt="" />
            </div>
            <div className="h3-reveal-scrim-top" />
            <div className="h3-reveal-scrim-bottom" />
            <div className="h3-reveal-bar" id="h3-reveal-bar">
              <span className="h3-reveal-flag" id="h3-reveal-flag">
                H1 · The system today
              </span>
            </div>
          </div>

          <div className="h3-panel-stack">
            {horizonPanels.map((panel, index) => (
              <article
                className="h3-panel"
                data-step={index}
                key={panel.tag}
                style={{ "--panel-color": panel.color } as React.CSSProperties}
              >
                <p>{panel.tag}</p>
                <h3>{panel.title}</h3>
                <p>{panel.body}</p>
              </article>
            ))}
          </div>

          <div className="h3-scroll-hint">SCROLL TO TRAVEL THE HORIZONS</div>
        </div>
      </section>

      <section id="pahlka" className="h3-quote-section">
        <div className="h3-container h3-quote-grid" data-reveal>
          <figure>
            <img src="/assets/jennifer-pahlka.jpg" alt="Jennifer Pahlka" />
            <figcaption>Photo · Fisher Studios</figcaption>
          </figure>
          <div className="h3-quote-copy">
            <p className="h3-quote-setup">
              The danger is not failed reform. The danger is reform that succeeds just enough
              to keep Congress from changing.
            </p>
            <blockquote>
              <div aria-hidden="true">&ldquo;</div>
              <p>
                Every H2- intervention that returns the system to &apos;good enough&apos; is
                now a bet that good enough will hold. It&apos;s a bet I no longer think we
                can afford to make.
              </p>
              <cite>
                <span>Jennifer Pahlka</span>
                <a
                  href="https://www.eatingpolicy.com/p/a-three-horizons-framework-for-government"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  A Three Horizons Framework for Government Reform →
                </a>
              </cite>
            </blockquote>
          </div>
        </div>
      </section>

      <section id="explore" className="h3-section h3-explore">
        <div className="h3-container">
          <div className="h3-explore-head" data-reveal>
            <p className="h3-eyebrow h3-eyebrow-accent">Explore</p>
            <h2 className="h3-statement">See the landscape of ideas.</h2>
            <p className="h3-explore-sub">
              View different visualizations of the same ideas.
            </p>
            <p className="h3-source-note">
              Ideas are sourced from interviews and existing literature, and are
              not necessarily originated by POPVOX Foundation.
            </p>
          </div>
          <div className="h3-explore-grid">
            {exploreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="h3-explore-card"
                data-reveal
              >
                <ExploreArt kind={link.art} />
                <h3>{link.title}</h3>
                <p>{link.body}</p>
                <span className="h3-explore-cta">Open {link.title} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="methodology" className="h3-section h3-methodology">
        <div className="h3-container">
          <div className="h3-methodology-head" data-reveal>
            <p className="h3-eyebrow">Methodology</p>
            <h2 className="h3-statement">How this was built.</h2>
            <p className="h3-methodology-placeholder">To be added.</p>
          </div>
        </div>
      </section>
    </>
  );
}
