import { Fragment } from "react";
import { horizonChip } from "../../data/horizons";
import { DOMAIN_LABELS, type H2Idea, type SourceLink } from "../../data/problemSpace";

// All tags associated with an idea, deduped, for the chip row. Sourced from the
// sheet's Additional Tags plus the idea's own domain labels.
export function itemTags(item: H2Idea): string[] {
  const raw = [
    ...item.additionalTags.split(",").map((t) => t.trim()),
    ...item.domains.map((d) => DOMAIN_LABELS[d])
  ].filter(Boolean);
  return Array.from(new Set(raw));
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="h3-domain-detail-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

// Matches the leading "H2+ #66." cross-reference the sheet puts at the start of a
// Path-to-H2+ note. Group 1 is the referenced H2+ idea's ID.
const H2PLUS_REF = /^\s*H2\+\s*#?(\d+[a-z]*)\.?\s*/i;

// The "Path to H2+" row. When the note opens with an "H2+ #N." reference to
// another idea, that prefix is replaced by a link to the referenced H2+ idea,
// labeled with its solution statement, so readers can jump straight to it.
function PathToH2PlusRow({
  value,
  ideaById,
  onOpenIdea
}: {
  value: string;
  ideaById?: Map<string, H2Idea>;
  onOpenIdea?: (item: H2Idea) => void;
}) {
  if (!value) return null;
  const match = value.match(H2PLUS_REF);
  const target = match && ideaById ? ideaById.get(match[1]) : undefined;

  if (!match || !target || !onOpenIdea) {
    // Unresolvable reference: show the note without the bare "H2+ #N." prefix.
    const plain = value.replace(H2PLUS_REF, "").trim() || value;
    return <DetailRow label="Path to H2+" value={plain} />;
  }

  const rest = value.slice(match[0].length).trim();
  return (
    <div className="h3-domain-detail-row">
      <dt>Path to H2+</dt>
      <dd>
        <button
          type="button"
          className="h3-domain-detail-link"
          onClick={() => onOpenIdea(target)}
        >
          {target.solutionStatement}
        </button>
        {rest && <>. {rest}</>}
      </dd>
    </div>
  );
}

// A metadata row whose value is a list of links (Sources / Learn more). Each item
// renders as its title — a hyperlink when a URL is present, plain text otherwise.
function LinkRow({ label, items }: { label: string; items: SourceLink[] }) {
  if (!items.length) return null;
  return (
    <div className="h3-domain-detail-row">
      <dt>{label}</dt>
      <dd className="h3-domain-detail-links">
        {items.map((item, i) => (
          <Fragment key={i}>
            {i > 0 && <span aria-hidden="true"> · </span>}
            {item.url ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            ) : (
              <span>{item.title}</span>
            )}
          </Fragment>
        ))}
      </dd>
    </div>
  );
}

// The full detail view for a single H2 idea: tag chips, the problem, the
// solution, and the horizon metadata grid. (The H1 status-quo framing now lives
// in the modal header.)
export function DomainItemDetail({
  item,
  onTagClick,
  ideaById,
  onOpenIdea
}: {
  item: H2Idea;
  onTagClick: (tag: string) => void;
  // Lets the "Path to H2+" note link to the referenced H2+ idea and open it.
  ideaById?: Map<string, H2Idea>;
  onOpenIdea?: (item: H2Idea) => void;
}) {
  const horizon = horizonChip(item.horizonKey);
  const tags = itemTags(item);
  return (
    <div className="h3-domain-detail">
      {tags.length > 0 && (
        <div className="h3-domain-tags">
          {tags.map((tag) => (
            <button
              className="h3-domain-tag"
              key={tag}
              type="button"
              onClick={() => onTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <p className="h3-domain-detail-kicker">The problem</p>
      <h2>{item.problemStatement}</h2>
      {item.problemDescription && (
        <p className="h3-domain-detail-body">{item.problemDescription}</p>
      )}

      <p className="h3-domain-detail-kicker h3-domain-detail-kicker-solution">The solution</p>
      <h3>{item.solutionStatement}</h3>
      {item.solutionDescription && (
        <p className="h3-domain-detail-body">{item.solutionDescription}</p>
      )}

      <dl className="h3-domain-detail-grid">
        <div className="h3-domain-detail-row">
          <dt>Horizon Classification</dt>
          <dd>
            <span className={`h3-domain-horizon ${horizon.className}`}>{horizon.label}</span>
          </dd>
        </div>
        {item.year && (
          <div className="h3-domain-detail-row">
            <dt>Time Horizon</dt>
            <dd>{item.year}</dd>
          </div>
        )}
        <DetailRow label="Horizon rationale" value={item.horizonJustification} />
        <PathToH2PlusRow
          value={item.pathToH2plus}
          ideaById={ideaById}
          onOpenIdea={onOpenIdea}
        />
        <DetailRow label="Current status" value={item.currentStatus} />
        <LinkRow label="Sources" items={item.sources} />
        <LinkRow label="Learn more" items={item.learnMore} />
      </dl>
    </div>
  );
}
