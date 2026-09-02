"use client";

import { useMemo, useState } from "react";
import { useReveal } from "../useReveal";
import {
  PROBLEM_AREAS,
  H2_IDEAS,
  type DomainKey
} from "../../data/problemSpace";
import { ProblemSpaceModal } from "./ProblemSpaceModal";
import { buildProblemSpaceGroups } from "./problemSpaceGroups";

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

  const [activeDomain, setActiveDomain] = useState<DomainKey | null>(null);

  // Every domain as a modal group, plus the "N items" count on each card. The
  // count = the H2−/H2+ ideas the domain's modal reveals; the shared builder
  // derives both by grouping the problem space on `area.domains`.
  const { groups, countByKey } = useMemo(
    () =>
      buildProblemSpaceGroups(
        (area) => area.domains,
        domains.map((domain) => domain.key),
        (key) => {
          const domain = domains.find((d) => d.key === key)!;
          // No eyebrow label for domains — the header shows only the Back control.
          return { title: domain.title, lede: domain.lede, eyebrowLabel: "" };
        }
      ),
    []
  );

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
            const count = countByKey.get(domain.key) ?? 0;
            return (
              <button
                className="h3-domain h3-domain-clickable"
                data-reveal
                key={domain.number}
                onClick={() => setActiveDomain(domain.key)}
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

      {activeDomain && (
        <ProblemSpaceModal
          groups={groups}
          activeGroupId={activeDomain}
          allAreas={PROBLEM_AREAS}
          allIdeas={H2_IDEAS}
          theme="light"
          onClose={() => setActiveDomain(null)}
        />
      )}
    </section>
  );
}
