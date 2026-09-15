import { horizonChip, isIdeaComplete } from "../../data/horizons";
import type { H2Idea } from "../../data/problemSpace";

// The H2−/H2+ idea ladder: a list of clickable idea rows, each chipped by
// horizon and opening the idea's detail. Shared by the H1→H3 pair frame (where
// it hangs under a status-quo→vision pair) and by blocks that list their ideas
// directly, with no overarching pair. Ideas whose target year has passed are
// faded and flagged "Complete".
export function IdeaList({
  ideas,
  onOpenIdea
}: {
  ideas: H2Idea[];
  onOpenIdea: (idea: H2Idea) => void;
}) {
  return (
    <ul className="h3-domain-list">
      {ideas.map((item) => {
        const horizon = horizonChip(item.horizonKey);
        const complete = isIdeaComplete(item.year);
        return (
          <li key={item.id}>
            <button
              className="h3-domain-list-item"
              data-complete={complete || undefined}
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
              {complete && (
                <span className="h3-domain-list-complete">Complete</span>
              )}
              <span className="h3-domain-list-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
