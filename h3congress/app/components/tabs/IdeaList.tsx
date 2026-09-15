import { horizonChip } from "../../data/horizons";
import type { H2Idea } from "../../data/problemSpace";

// The H2−/H2+ idea ladder: a list of clickable idea rows, each chipped by
// horizon and opening the idea's detail. Shared by the H1→H3 pair frame (where
// it hangs under a status-quo→vision pair) and by blocks that list their ideas
// directly, with no overarching pair.
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
  );
}
