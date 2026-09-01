import Link from "next/link";
import { horizonChip } from "../../data/horizons";
import type { H2Idea, ProblemArea } from "../../data/problemSpace";

// One H1 status-quo → H3 vision pair, expandable to reveal the H2−/H2+ idea
// ladder mapped to it. Shared verbatim by the Domains tab and the System Diagram
// tab — the two only differ in how they group areas (by domain vs by diagram
// block), never in how a pair renders.
export function HorizonPairFrame({
  area,
  ideas,
  open,
  onToggle,
  onOpenIdea
}: {
  area: ProblemArea;
  ideas: H2Idea[];
  open: boolean;
  onToggle: () => void;
  onOpenIdea: (idea: H2Idea) => void;
}) {
  const hasIdeas = ideas.length > 0;

  const cols = (
    <div className="h3-domain-status-cols">
      <div className="h3-domain-status-col is-h1">
        <span className="h3-domain-horizon is-h1">H1 · Status quo</span>
        <span className="h3-domain-status-statement">{area.h1Statement}</span>
        {open && area.h1Description && (
          <span className="h3-domain-status-desc">{area.h1Description}</span>
        )}
      </div>
      <div className="h3-domain-status-arrow" aria-hidden="true">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </div>
      <div className="h3-domain-status-col is-h3">
        <span className="h3-domain-horizon is-h3">H3 · Vision</span>
        <span className="h3-domain-status-statement">{area.h3Statement}</span>
        {open && area.h3Description && (
          <span className="h3-domain-status-desc">{area.h3Description}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="h3-domain-frame" data-clickable="true">
      <button
        type="button"
        className="h3-domain-status is-clickable"
        aria-expanded={open}
        onClick={onToggle}
      >
        {cols}
        <span
          className="h3-domain-status-chevron"
          data-open={open}
          aria-hidden="true"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="h3-domain-frame-list">
          {hasIdeas ? (
            <ul className="h3-domain-list">
              {ideas.map((item) => {
                const horizon = horizonChip(item.horizonKey);
                return (
                  <li key={item.id}>
                    <button
                      className="h3-domain-list-item"
                      onClick={() => onOpenIdea(item)}
                      type="button"
                    >
                      <span className={`h3-domain-horizon ${horizon.className}`}>
                        {horizon.label}
                      </span>
                      <span className="h3-domain-list-text">
                        <span className="h3-domain-list-title">
                          {item.solutionStatement}
                        </span>
                      </span>
                      <span className="h3-domain-list-arrow" aria-hidden="true">
                        →
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="h3-domain-frame-empty">
              No H2 ideas.{" "}
              <Link href="/get-involved" className="h3-domain-empty-cta">
                Submit your ideas here.
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
