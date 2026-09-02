"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { H2Idea, ProblemArea } from "../../data/problemSpace";
import { DomainItemDetail, itemTags } from "./DomainDetail";
import { DomainTagDrawer } from "./DomainTagDrawer";
import { HorizonPairFrame } from "./HorizonPairFrame";

export type ProblemSpaceGroup = {
  /** Heading shown at the top of the list view (domain / block name). */
  title: string;
  /** One-line description under the heading. */
  lede: string;
  /** Small label in the modal head, e.g. a domain number or the diagram node. */
  eyebrowLabel: string;
  /** The H1→H3 pairs to show, in display order. */
  areas: ProblemArea[];
};

// The full problem-space explorer surface: a modal that walks a group's H1→H3
// pairs → the H2 ideas under each → a single idea's detail, plus the tag drawer.
// It is the shared "infrastructure" both tabs open; the only thing that varies
// between them is the `group` (how areas were selected) and the `theme` skin.
export function ProblemSpaceModal({
  group,
  allAreas,
  allIdeas,
  theme = "light",
  onClose,
  resolveGroup
}: {
  group: ProblemSpaceGroup;
  /** Every problem area site-wide — frames an idea against its primary H1/H3. */
  allAreas: ProblemArea[];
  /** Every H2 idea site-wide — feeds the per-area ladders and the tag drawer. */
  allIdeas: H2Idea[];
  theme?: "light" | "dark";
  onClose: () => void;
  /**
   * Given an idea opened from the tag drawer (which searches the whole site),
   * return the group for that idea's own domain so the panel behind the drawer
   * can follow it across domains. `currentTitle` lets the resolver keep the
   * current domain when the idea also belongs to it. Omitted by callers whose
   * group isn't domain-based (e.g. the system diagram), leaving behavior as-is.
   */
  resolveGroup?: (item: H2Idea, currentTitle: string) => ProblemSpaceGroup | null;
}) {
  const [activeItem, setActiveItem] = useState<H2Idea | null>(null);
  const [openAreas, setOpenAreas] = useState<Set<string>>(new Set());
  const [activeTag, setActiveTag] = useState<string | null>(null);
  // A tag-drawer selection can land on an idea from a different domain; when it
  // does we swap in that idea's own group so the header, lede, and "Back to
  // list" all reflect the domain you were actually taken to.
  const [overrideGroup, setOverrideGroup] = useState<ProblemSpaceGroup | null>(
    null
  );
  // Clear the override whenever the caller opens a genuinely different group.
  useEffect(() => {
    setOverrideGroup(null);
  }, [group.title]);
  const effectiveGroup = overrideGroup ?? group;

  // Open an idea, following it to its own domain when it came from the drawer.
  const openItemFromDrawer = (item: H2Idea) => {
    setActiveItem(item);
    const next = resolveGroup?.(item, effectiveGroup.title);
    if (next) setOverrideGroup(next);
  };

  const toggleArea = (id: string) =>
    setOpenAreas((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const areaById = useMemo(
    () => new Map(allAreas.map((area) => [area.id, area])),
    [allAreas]
  );

  // H2−/H2+ ideas grouped by the problem area(s) they address (via h1h3Ids), so
  // each H1→H3 pair reveals exactly the ideas mapped to it. H2− first.
  const ideasByArea = useMemo(() => {
    const map = new Map<string, H2Idea[]>();
    for (const idea of allIdeas) {
      for (const areaId of idea.h1h3Ids) {
        if (!map.has(areaId)) map.set(areaId, []);
        map.get(areaId)!.push(idea);
      }
    }
    for (const list of map.values()) {
      list.sort(
        (a, b) =>
          (a.horizonKey === "h2neg" ? 0 : 1) - (b.horizonKey === "h2neg" ? 0 : 1)
      );
    }
    return map;
  }, [allIdeas]);

  // Escape closes the tag drawer first, then the detail view, then the modal.
  // Lock body scroll while open.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (activeTag) setActiveTag(null);
      else if (activeItem) setActiveItem(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeItem, activeTag, onClose]);

  // H2−/H2+ ideas that carry the clicked tag — powers the drawer (searches the
  // whole site, not just this group).
  const tagIdeas = activeTag
    ? allIdeas.filter((it) => itemTags(it).includes(activeTag))
    : [];

  const activeArea =
    activeItem && activeItem.h1h3Ids.length
      ? areaById.get(activeItem.h1h3Ids[0]) ?? null
      : null;

  const anyIdeas = effectiveGroup.areas.some(
    (area) => (ideasByArea.get(area.id) ?? []).length > 0
  );

  return (
    <>
      <div
        className="h3-domain-modal-scrim"
        data-theme={theme}
        onClick={onClose}
        role="presentation"
      >
        <div
          className="h3-domain-modal"
          role="dialog"
          aria-modal="true"
          aria-label={effectiveGroup.title}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="h3-domain-modal-head">
            <div className="h3-domain-modal-head-left">
              <button
                className="h3-domain-back"
                onClick={activeItem ? () => setActiveItem(null) : onClose}
                aria-label={activeItem ? "Back to list" : "Back"}
                type="button"
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
                  aria-hidden="true"
                >
                  <path d="M19 12H5" />
                  <path d="M11 6l-6 6 6 6" />
                </svg>
                Back
              </button>
              <span className="h3-domain-modal-eyebrow">
                {activeItem ? effectiveGroup.title : effectiveGroup.eyebrowLabel}
              </span>
              {activeItem && activeArea?.h1Statement && (
                <span className="h3-domain-modal-h1">
                  {activeArea.h1Statement}
                </span>
              )}
            </div>
            <button
              aria-label="Close"
              className="h3-domain-modal-close"
              onClick={onClose}
              type="button"
            >
              ×
            </button>
          </div>

          {activeItem ? (
            <DomainItemDetail item={activeItem} onTagClick={setActiveTag} />
          ) : (
            <div className="h3-domain-modal-body">
              <h2>{effectiveGroup.title}</h2>
              <p className="h3-domain-modal-lede">{effectiveGroup.lede}</p>

              {anyIdeas && (
                <p className="h3-domain-modal-instruction">
                  Click a pair of H1 → H3 to see the possible implementation
                  ideas in between.
                </p>
              )}

              {effectiveGroup.areas.length === 0 ? (
                <p className="h3-domain-empty">
                  No H1 status quo or H3 vision has been mapped here yet.{" "}
                  <Link href="/get-involved" className="h3-domain-empty-cta">
                    Submit your ideas.
                  </Link>
                </p>
              ) : (
                effectiveGroup.areas.map((area) => (
                  <HorizonPairFrame
                    key={area.id}
                    area={area}
                    ideas={ideasByArea.get(area.id) ?? []}
                    open={openAreas.has(area.id)}
                    onToggle={() => toggleArea(area.id)}
                    onOpenIdea={setActiveItem}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {activeTag && (
        <DomainTagDrawer
          tag={activeTag}
          ideas={tagIdeas}
          activeId={activeItem?.id}
          theme={theme}
          onSelect={openItemFromDrawer}
          onClose={() => setActiveTag(null)}
        />
      )}
    </>
  );
}
