import { horizonChip } from "../../data/horizons";
import { DOMAIN_LABELS, type H2Idea } from "../../data/problemSpace";

// Slide-in drawer listing the H2−/H2+ ideas that carry a clicked tag. Shared by
// the Domains tab (light) and the System Diagram tab (dark) via `theme`. Clicking
// an idea navigates the panel behind the drawer to it while the drawer stays up.
export function DomainTagDrawer({
  tag,
  ideas,
  activeId,
  theme = "light",
  onSelect,
  onClose
}: {
  tag: string;
  ideas: H2Idea[];
  activeId?: string;
  theme?: "light" | "dark";
  onSelect: (item: H2Idea) => void;
  onClose: () => void;
}) {
  return (
    <div className="h3-tag-scrim" data-theme={theme} onClick={onClose} role="presentation">
      <aside
        className="h3-tag-drawer"
        role="dialog"
        aria-label={`Ideas tagged ${tag}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="h3-tag-drawer-head">
          <div className="h3-tag-drawer-head-row">
            <span className="h3-tag-drawer-eyebrow">Tagged</span>
            <button
              className="h3-tag-drawer-close"
              onClick={onClose}
              aria-label="Close"
              type="button"
            >
              ×
            </button>
          </div>
          <h3 className="h3-tag-drawer-title">{tag}</h3>
          <p className="h3-tag-drawer-count">
            {ideas.length} {ideas.length === 1 ? "idea" : "ideas"}
          </p>
        </div>
        <div className="h3-tag-drawer-body">
          {ideas.map((item) => {
            const horizon = horizonChip(item.horizonKey);
            return (
              <button
                className="h3-tag-soln"
                key={item.id}
                type="button"
                aria-current={item.id === activeId}
                data-active={item.id === activeId}
                onClick={() => onSelect(item)}
              >
                <div className="h3-tag-soln-top">
                  <span className={`h3-domain-horizon ${horizon.className}`}>
                    {horizon.label}
                  </span>
                  <span className="h3-tag-soln-context">
                    {item.domains.map((d) => DOMAIN_LABELS[d]).join(" · ")}
                  </span>
                </div>
                <span className="h3-tag-soln-title">{item.solutionStatement}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
