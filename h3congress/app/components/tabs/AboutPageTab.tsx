"use client";

import { useReveal } from "../useReveal";

export default function AboutPageTab() {
  useReveal();

  return (
    <>
      <section id="methodology" className="h3-section h3-methodology tex-grid-fine">
        <div className="h3-container">
          <div className="h3-methodology-head" data-reveal>
            <p className="h3-eyebrow">Methodology</p>
            <h2 className="h3-statement">How this was built.</h2>
          </div>
          <div className="h3-methodology-body" data-reveal>
            <p>
              This map was built on an extensive base of research: a wide review
              of existing literature on Congress and its capacity, alongside more
              than fifty candid in-depth interviews with people who know the
              institution from the inside.
            </p>
            <p>
              The people we spoke with span the community that shapes how Congress
              works: current and former congressional staff across personal
              offices, committees, and leadership; legislative-branch support
              offices; congressional-reform and good-government organizations;
              researchers working on institutions and the future of governance;
              academics; civic-technology practitioners; and government-relations
              professionals.
            </p>
            <p>
              Because the volume of material was large, AI was used as a research
              and synthesis aid — to search across sources, research, and
              interview notes; to summarize long documents; and to surface and
              consolidate overlapping or redundant ideas so the map does not
              count the same proposal multiple times. Every classification,
              and every decision about what to include or leave out, remains a
              human editorial judgment, and all of the site&rsquo;s content has
              been reviewed by people. The website itself was generated primarily
              with Claude Code.
            </p>
          </div>
        </div>
      </section>

      <section id="popvox" className="h3-section h3-methodology">
        <div className="h3-container">
          <div className="h3-methodology-head" data-reveal>
            <p className="h3-eyebrow">About</p>
            <h2 className="h3-statement">POPVOX Foundation</h2>
          </div>
          <div className="h3-methodology-body" data-reveal>
            <p>
              This project is a product of{" "}
              <a
                href="https://www.popvox.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                POPVOX Foundation
              </a>
              , a nonpartisan nonprofit passionate about supporting the U.S.
              Congress as it tackles the pacing problem.
            </p>
            <p>
              The Foundation works with legislative bodies — the U.S. Congress,
              state legislatures, and parliaments around the world — on
              responsible AI adoption, tech literacy, and software prototyping,
              helping democratic institutions build the capacity to govern in a
              fast-changing world.
            </p>
          </div>
        </div>
      </section>

      <section id="recoding-america" className="h3-section h3-methodology tex-grid-dense">
        <div className="h3-container">
          <div className="h3-methodology-head" data-reveal>
            <p className="h3-eyebrow">About</p>
            <h2 className="h3-statement">Recoding America</h2>
          </div>
          <div className="h3-methodology-body" data-reveal>
            <p>
              <a
                href="https://recodingamerica.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Recoding America
              </a>{" "}
              is a cross-ideological initiative working to transform how American
              government operates at a fundamental level — moving from an
              industrial-era operating model to one suited for modern challenges,
              so government can reliably deliver outcomes in a fast-changing world.
            </p>
            <p>
              Acting as a field catalyst, it convenes diverse stakeholders across
              ideological lines and supports reforms in how government hires
              talent, procures goods and services, builds systems, and learns from
              experience — at both the federal and state levels.
            </p>
          </div>
        </div>
      </section>

      <section id="author" className="h3-section h3-methodology tex-dots">
        <div className="h3-container">
          <div className="h3-methodology-head" data-reveal>
            <p className="h3-eyebrow">About</p>
            <h2 className="h3-statement">The author</h2>
          </div>
          <div className="h3-methodology-body" data-reveal>
            <p>
              <a
                href="https://www.popvox.org/blog/welcome-ashley-nagel"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ashley Nagel
              </a>{" "}
              is Senior Manager for Government Innovation at POPVOX Foundation,
              where she leads the organization&rsquo;s congressional engagement
              strategy.
            </p>
            <p>
              She previously served as a Senate legislative fellow focused on AI
              policy and government modernization. Before entering public service,
              she was a senior software automation engineer at Apple and developed
              software for Honeywell Aerospace. Ashley holds a B.S. and M.S. in
              Electrical Engineering from Columbia University.
            </p>
          </div>
        </div>
      </section>

      <section id="acknowledgments" className="h3-section h3-methodology">
        <div className="h3-container">
          <div className="h3-methodology-head" data-reveal>
            <p className="h3-eyebrow">Acknowledgments</p>
            <h2 className="h3-statement">With thanks.</h2>
          </div>
          <div className="h3-methodology-body" data-reveal>
            <p>
              Our sincere thanks to everyone who gave their time to be
              interviewed — this work would not exist without your candor and
              insight. We are also grateful to Recoding America for their support
              of this project.
            </p>
            <p>
              Ashley would like to especially thank and acknowledge her
              colleagues, Caitlin McNally, Aubrey Wilson, and Marci Harris, for
              their contributions and encouragement! &lt;3
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
