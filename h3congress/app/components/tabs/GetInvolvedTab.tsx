"use client";

import { FormEvent, useMemo, useState } from "react";
import { useReveal } from "../useReveal";

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

export default function GetInvolvedTab() {
  useReveal();

  const [vision, setVision] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [formLoadedAt] = useState(() => Date.now());
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [idea, setIdea] = useState("");
  const [checks, setChecks] = useState(() => criteria.map(() => false));
  const [detailIndex, setDetailIndex] = useState<number | null>(null);
  const count = checks.filter(Boolean).length;
  const result = useMemo(() => readout(count), [count]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/visions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vision, role, email, website, formLoadedAt })
      });
      const result = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) {
        setError(result.message || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmitIdea() {
    const trimmedIdea = idea.trim();
    if (!trimmedIdea) return;

    const selectedCriteria = criteria
      .filter((_, index) => checks[index])
      .map((criterion) => `- ${criterion.title}`);
    const summary = [
      `H3 idea: ${trimmedIdea}`,
      `Litmus result: ${result.title} (${count} / ${criteria.length})`,
      selectedCriteria.length
        ? `Criteria selected:\n${selectedCriteria.join("\n")}`
        : "Criteria selected: None yet.",
      "",
      "Additional context:"
    ].join("\n");

    setVision(summary);
    setError("");
    document.getElementById("involved")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
    window.setTimeout(() => {
      document.getElementById("vision")?.focus({ preventScroll: true });
    }, 500);
  }

  return (
    <>
      <section id="distinction" className="h3-distinction">
        <div className="h3-container" data-reveal>
          <p className="h3-eyebrow h3-eyebrow-gold">No single H3</p>
          <h2>
            <span className="h3-h3gold">H3</span> is the destination.{" "}
            <span className="h3-h2pos">H2+</span> is the path.
          </h2>
          <p>
            The third horizon is a described future state;{" "}
            <span className="h3-h2pos">H2+</span> is the move, available today,
            that builds toward it.
          </p>
          <p>
            The same effort can read as{" "}
            <span className="h3-h2pos">H2+</span> to one person and{" "}
            <span className="h3-h2neg">H2-</span> to another: it depends on which
            third horizon they are trying to build. The disagreement is not a flaw in
            the framework. It is the conversation the framework is for.
          </p>
          <p>
            There is no single H3 — there are many third horizons, each worth
            articulating and debating. A third horizon is always a moving target. The point is not to
            wait for perfect consensus. It is to describe an operating model fit for
            purpose and invite the field to compare notes.
          </p>
        </div>
      </section>

      <section id="h3-test" className="h3-litmus">
        <div className="h3-container h3-litmus-grid">
          <div data-reveal>
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
                    aria-pressed={checked}
                    className={checked ? "is-checked" : ""}
                    key={criterion.title}
                    onClick={() =>
                      setChecks((current) =>
                        current.map((value, valueIndex) =>
                          valueIndex === index ? !value : value
                        )
                      )
                    }
                    onMouseEnter={() => setDetailIndex(index)}
                    onFocus={() => setDetailIndex(index)}
                    type="button"
                  >
                    <span aria-hidden="true">{checked ? "✓" : ""}</span>
                    {criterion.title}
                  </button>
                );
              })}
            </div>
          </div>
          <aside className="h3-litmus-side" data-reveal>
            <div className="h3-litmus-readout">
              <div>
                <span>Reading</span>
                <span>{count} / 6</span>
              </div>
              <div className="h3-litmus-meter" aria-hidden="true">
                <span style={{ width: `${Math.round((count / criteria.length) * 100)}%` }} />
              </div>
              <h3 style={{ color: result.color }}>{idea ? `“${idea}”` : result.title}</h3>
              <p>{result.body}</p>
              <button
                className="h3-litmus-submit"
                disabled={!idea.trim()}
                onClick={handleSubmitIdea}
                type="button"
              >
                Submit this idea
              </button>
              <p className="h3-litmus-submit-note">
                Copies a summary into the feedback form so you can review it before sharing.
              </p>
            </div>
            <div className="h3-litmus-detail">
              {detailIndex === null ? (
                <>
                  <span>Six characteristics</span>
                  <p>Hover over a test on the left to see what it means.</p>
                </>
              ) : (
                <>
                  <span>Characteristic {String(detailIndex + 1).padStart(2, "0")}</span>
                  <h3>{criteria[detailIndex].title}</h3>
                  <p>{criteria[detailIndex].body}</p>
                </>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section id="involved" className="h3-involved">
        <div className="h3-container h3-involved-grid">
          <div data-reveal>
            <p className="h3-eyebrow h3-eyebrow-gold">Get involved</p>
            <h2>Help make the map more accurate.</h2>
            <p>
              This project is being built with people who know Congress from the inside:
              congressional offices, committees, support agencies, reform organizations,
              academics, technologists, and comparative parliament experts.
            </p>
            <p>
              If you see a missing reform, a weak classification, a better example, or a blind
              spot, tell us. If the map does not reflect your experience of how Congress
              actually works, that is exactly the kind of input we need.
            </p>
          </div>
          <div data-reveal>
            {submitted ? (
              <div className="h3-thanks" role="status">
                <div aria-hidden="true">✦</div>
                <h3>Thanks, we received your input.</h3>
                <p>
                  The team will review it as interviews continue and the project becomes
                  more complete.
                </p>
              </div>
            ) : (
              <form className="h3-form" onSubmit={handleSubmit}>
                <label htmlFor="vision">
                  What should this project understand, add, or correct?
                </label>
                <textarea
                  id="vision"
                  rows={4}
                  value={vision}
                  onChange={(event) => setVision(event.target.value)}
                  placeholder="Share an H3 capability, a reform effort, a missing source, or feedback on the framing."
                  required
                />
                <div className="h3-honeypot" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                </div>
                <div className="h3-form-row">
                  <input
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    placeholder="Your role / org"
                    aria-label="Your role or organization"
                  />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email (optional)"
                    aria-label="Email optional"
                    type="email"
                  />
                </div>
                {error && <p className="h3-form-error">{error}</p>}
                <button type="submit" disabled={submitting}>
                  {submitting ? "Sharing..." : "Share input"}
                </button>
                <p>
                  Feedback, disagreements, and suggested interviews will make the map sharper.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
