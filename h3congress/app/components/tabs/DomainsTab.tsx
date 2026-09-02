"use client";

import { useMemo, useState } from "react";
import { useReveal } from "../useReveal";
import {
  PROBLEM_AREAS,
  H2_IDEAS,
  type DomainKey,
  type ProblemArea,
  type H2Idea
} from "../../data/problemSpace";
import { ProblemSpaceModal, type ProblemSpaceGroup } from "./ProblemSpaceModal";

type Domain = {
  number: string;
  key: DomainKey;
  title: string;
  body: string;
  // Concise one-line description shown as the lede when the domain is opened.
  lede: string;
};

const domains: Domain[] = [
  {
    number: "01",
    key: "capacity",
    title: "Institutional Capacity & Support Structures",
    body:
      "The institutions Congress relies on for expertise, analysis, and operational support, and the new models it may need for technical capacity, data infrastructure, and nonpartisan advice.",
    lede: "The expertise and support institutions Congress runs on."
  },
  {
    number: "02",
    key: "staffing",
    title: "Staffing & Talent",
    body:
      "How Congress attracts, develops, retains, and deploys the people it needs, including technical talent, policy expertise, professional development, compensation, and career pathways.",
    lede: "How Congress attracts, develops, and keeps the people it needs."
  },
  {
    number: "03",
    key: "information",
    title: "Information & Knowledge Infrastructure",
    body:
      "How Congress collects, organizes, shares, and uses information: constituent communications, casework data, legislative drafting tools, oversight dashboards, evidence, and institutional memory.",
    lede: "How Congress collects, shares, and reuses what it knows."
  },
  {
    number: "04",
    key: "technology",
    title: "Technology & Systems",
    body:
      "The internal systems that shape congressional work: administrative tools, cybersecurity, collaboration platforms, interoperability, and the digital infrastructure behind constituent services and legislative operations.",
    lede: "The systems and tools congressional work runs on."
  },
  {
    number: "05",
    key: "oversight",
    title: "Oversight & Feedback Loops",
    body:
      "How Congress learns whether laws work after enactment, and how oversight, appropriations, implementation data, and public experience flow back into legislative decision-making.",
    lede: "How Congress learns whether laws work — and adapts."
  }
];

export default function DomainsTab() {
  useReveal();

  const [activeDomain, setActiveDomain] = useState<Domain | null>(null);

  // The "N items" on each domain card = the H2−/H2+ ideas the domain's modal
  // actually reveals. The modal lists ideas by the problem area(s) they address
  // (idea.h1h3Ids → area), and a domain surfaces the areas tagged to it, so the
  // count is derived the same way to stay in sync with what opens.
  const ideaCountByDomain = useMemo(() => {
    const areaDomains = new Map<string, DomainKey[]>();
    for (const area of PROBLEM_AREAS) {
      areaDomains.set(area.id, area.domains);
    }
    const map = new Map<DomainKey, Set<string>>();
    for (const idea of H2_IDEAS) {
      if (idea.horizonKey !== "h2neg" && idea.horizonKey !== "h2pos") continue;
      const domains = new Set<DomainKey>();
      for (const areaId of idea.h1h3Ids) {
        for (const key of areaDomains.get(areaId) ?? []) domains.add(key);
      }
      for (const key of domains) {
        if (!map.has(key)) map.set(key, new Set());
        map.get(key)!.add(idea.id);
      }
    }
    return map;
  }, []);

  // H1 status quo → H3 vision problem areas grouped by domain. A domain can hold
  // several — all of them are shown, stacked, at the top of the domain view.
  const areasByDomain = useMemo(() => {
    const map = new Map<DomainKey, ProblemArea[]>();
    for (const area of PROBLEM_AREAS) {
      for (const key of area.domains) {
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(area);
      }
    }
    return map;
  }, []);

  const buildGroup = (domain: Domain): ProblemSpaceGroup => ({
    title: domain.title,
    lede: domain.lede,
    // No eyebrow label for domains — the header shows only the Back control.
    eyebrowLabel: "",
    areas: areasByDomain.get(domain.key) ?? []
  });

  const activeGroup: ProblemSpaceGroup | null = activeDomain
    ? buildGroup(activeDomain)
    : null;

  // When an idea is opened from the tag drawer it may live in another domain.
  // Resolve that idea's own domain group so the modal follows it there — but if
  // the idea also belongs to the domain you're already in, stay put.
  const resolveGroupForIdea = (
    item: H2Idea,
    currentTitle: string
  ): ProblemSpaceGroup | null => {
    if (!item.domains.length) return null;
    const stay = domains.find(
      (d) => d.title === currentTitle && item.domains.includes(d.key)
    );
    const target = stay ?? domains.find((d) => d.key === item.domains[0]);
    return target ? buildGroup(target) : null;
  };

  return (
    <section id="domains" className="h3-domains h3-domains-tab">
      <div className="h3-container">
        <div className="h3-domains-intro" data-reveal>
          <p className="h3-eyebrow">The landscape</p>
          <h2>Where congressional capacity gets built — or gets stuck.</h2>
          <p>
            H3 begins with five domains. Each one contains ideas that can point in
            different directions. <strong>Select a domain</strong> to see the problems and
            solutions mapped to it.
          </p>
          <p className="h3-source-note">
            Ideas are sourced from interviews and existing literature, and are not
            necessarily originated by POPVOX Foundation.
          </p>
        </div>
        <div className="h3-domain-grid">
          {domains.map((domain) => {
            const count = ideaCountByDomain.get(domain.key)?.size ?? 0;
            return (
              <button
                className="h3-domain h3-domain-clickable"
                data-reveal
                key={domain.number}
                onClick={() => setActiveDomain(domain)}
                type="button"
              >
                <p>{domain.number}</p>
                <h3>{domain.title}</h3>
                <p>{domain.body}</p>
                <span className="h3-domain-count">
                  {count} {count === 1 ? "item" : "items"}
                  <span aria-hidden="true">→</span>
                </span>
              </button>
            );
          })}
          <article className="h3-domain h3-domain-summary" data-reveal>
            <p>
              Each domain faces the same test: does the idea preserve{" "}
              <span className="h3-h2neg">H1</span>, build{" "}
              <span className="h3-h2pos">H2+</span>, or point toward{" "}
              <span className="h3-h3gold">H3</span>?
            </p>
          </article>
        </div>
      </div>

      {activeGroup && (
        <ProblemSpaceModal
          group={activeGroup}
          allAreas={PROBLEM_AREAS}
          allIdeas={H2_IDEAS}
          theme="light"
          onClose={() => setActiveDomain(null)}
          resolveGroup={resolveGroupForIdea}
        />
      )}
    </section>
  );
}
