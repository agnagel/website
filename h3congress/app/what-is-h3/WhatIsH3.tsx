"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import H3SimpleFooter from "../components/H3SimpleFooter";
import H3SimpleHeader from "../components/H3SimpleHeader";

const criteria = [
  {
    title: "It changes the conditions, not the symptoms.",
    body:
      "The symptom is the office that cannot hire; the condition is the hiring system. H3 work targets what produces the problem."
  },
  {
    title: "It works horizontally, for everyone.",
    body:
      "The change is not a carve-out for one office, committee, or favored team. It changes the operating model across the institution."
  },
  {
    title: "It builds permanent capability the institution owns.",
    body:
      "Borrowed capacity can help. H3 asks whether the institution becomes more capable after the outside help leaves."
  },
  {
    title: "It already exists in a pocket of practice.",
    body:
      "A third horizon is not fantasy. Somewhere, a version of the future should already be visible enough to learn from."
  },
  {
    title: "It leaves the institution more able to keep adapting.",
    body:
      "The goal is not one perfect fix. It is an operating model that can keep learning as the environment changes."
  },
  {
    title: "It is specific and contestable.",
    body:
      "A useful H3 can be argued with. It describes a concrete future system, not just a hopeful value."
  }
];

function readout(count: number) {
  if (count <= 1) {
    return {
      title: "Not yet on the horizon",
      color: "#b3543e",
      body:
        "As described, this mostly sustains today's system. That can still be valuable work; name it honestly and look for the move upstream."
    };
  }
  if (count <= 3) {
    return {
      title: "Transitional",
      color: "#a87d1f",
      body:
        "There is H3 DNA here, but it also props up the present. Find where it could go further upstream or build lasting capability."
    };
  }
  if (count <= 5) {
    return {
      title: "Building toward H3",
      color: "#2e7d64",
      body:
        "This changes conditions and builds capability. Strong H2+. Now name the third horizon it is building toward."
    };
  }
  return {
    title: "A Horizon 3 idea",
    color: "#a87d1f",
    body:
      "This describes a different system doing different work. Make it concrete enough to debate, then put it on the table."
  };
}

export default function WhatIsH3() {
  const [idea, setIdea] = useState("");
  const [checks, setChecks] = useState(() => criteria.map(() => false));
  const count = checks.filter(Boolean).length;
  const result = useMemo(() => readout(count), [count]);

  return (
    <main id="h3-root">
      <H3SimpleHeader />

      <header className="h3-sub-hero h3-sub-hero-dark">
        <div className="h3-container">
          <p className="h3-eyebrow h3-eyebrow-gold">Framework explainer</p>
          <h1>What is Horizon 3?</h1>
          <p>
            Horizon 3 is not the current institution doing the same work faster. It is a
            different operating model: a Congress with capabilities, feedback loops, and
            institutional muscle that today&apos;s system does not yet have.
          </p>
          <div className="h3-sub-actions">
            <a href="#h3-test">Test an idea</a>
            <Link href="/#reform-map">See the map</Link>
          </div>
        </div>
      </header>

      <section className="h3-page-section">
        <div className="h3-container h3-split">
          <div>
            <p className="h3-eyebrow">The distinction</p>
            <h2>H3 is the destination. H2+ is the path.</h2>
          </div>
          <div className="h3-rich-copy">
            <p>
              You cannot leap from H1 to H3. H3 is the described future state; H2+ is the
              move, available today, that builds toward it.
            </p>
            <p>
              That is why the same effort can read as H2+ to one person and H2- to another:
              it depends on which third horizon they are trying to build. The disagreement
              is not a flaw in the framework. It is the conversation the framework is for.
            </p>
          </div>
        </div>
      </section>

      <section className="h3-page-section h3-page-section-alt">
        <div className="h3-container">
          <div className="h3-section-heading">
            <p className="h3-eyebrow">Six characteristics</p>
            <h2>The tests behind the horizon.</h2>
          </div>
          <div className="h3-criteria-grid">
            {criteria.map((criterion, index) => (
              <article className="h3-criterion" key={criterion.title}>
                <p>{String(index + 1).padStart(2, "0")}</p>
                <h3>{criterion.title}</h3>
                <p>{criterion.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="h3-test" className="h3-page-section h3-litmus">
        <div className="h3-container h3-litmus-grid">
          <div>
            <p className="h3-eyebrow h3-eyebrow-gold">Litmus test</p>
            <h2>Test an idea against the third horizon.</h2>
            <label htmlFor="h3-idea">Name the idea you are testing</label>
            <input
              id="h3-idea"
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              placeholder="A future congressional capability"
            />
            <div className="h3-checklist">
              {criteria.map((criterion, index) => {
                const checked = checks[index];
                return (
                  <button
                    className={checked ? "is-checked" : ""}
                    key={criterion.title}
                    onClick={() =>
                      setChecks((current) =>
                        current.map((value, valueIndex) =>
                          valueIndex === index ? !value : value
                        )
                      )
                    }
                    type="button"
                  >
                    <span aria-hidden="true">{checked ? "✓" : ""}</span>
                    {criterion.title}
                  </button>
                );
              })}
            </div>
          </div>
          <aside className="h3-litmus-readout">
            <div>
              <span>Reading</span>
              <span>{count} / 6</span>
            </div>
            <div className="h3-litmus-meter" aria-hidden="true">
              <span style={{ width: `${Math.round((count / criteria.length) * 100)}%` }} />
            </div>
            <h3 style={{ color: result.color }}>{idea ? `“${idea}”` : result.title}</h3>
            <p>{result.body}</p>
          </aside>
        </div>
      </section>

      <section className="h3-page-section h3-page-section-dark">
        <div className="h3-container">
          <p className="h3-eyebrow h3-eyebrow-gold">There is no single H3</p>
          <h2>Many third horizons. Worth articulating, worth debating.</h2>
          <p>
            A third horizon is always a moving target. The point is not to wait for perfect
            consensus. It is to describe an operating model fit for purpose and invite the
            field to compare notes.
          </p>
          <div className="h3-sub-actions">
            <Link href="/#involved">Write your H3</Link>
            <Link href="/#reform-map">See where reforms sit today</Link>
          </div>
        </div>
      </section>

      <H3SimpleFooter />
    </main>
  );
}
