import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="h3-footer">
      <div className="h3-container h3-footer-row">
        <div className="h3-footer-brand">
          <h3>Three Horizons Vision for Congress</h3>
          <div className="h3-footer-brand-body">
            <img className="h3-footer-mark" src="/assets/h3-logo.png" alt="H3 Congress" />
            <p>
              An interactive project mapping the structural capacity gap in the
              legislative branch, built in public by POPVOX Foundation.
            </p>
          </div>
        </div>

        <div className="h3-partners">
          <div>
            <span>A project of</span>
            <a
              href="http://popvox.org"
              aria-label="Visit POPVOX Foundation"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/assets/popvox-fdn-clear.png" alt="POPVOX Foundation" />
            </a>
          </div>
          <div>
            <span>With support from</span>
            <a
              href="https://www.recodingamerica.fund/"
              aria-label="Visit Recoding America Fund"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/assets/raf-clear.png" alt="Recoding America Fund" />
            </a>
          </div>
        </div>

        <nav className="h3-footer-col">
          <h3>Explore</h3>
          <Link href="/">About</Link>
          <Link href="/reform-map">Reform Map</Link>
          <Link href="/domains">Domains</Link>
          <Link href="/system-diagram">System Diagram</Link>
        </nav>

        <nav className="h3-footer-col">
          <h3>Foundations</h3>
          <a
            href="https://www.eatingpolicy.com/p/a-three-horizons-framework-for-government"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Three Horizons framework →
          </a>
          <a
            href="https://www.popvox.org/blog/the-pacing-problem"
            target="_blank"
            rel="noopener noreferrer"
          >
            The pacing problem →
          </a>
        </nav>

        <div className="h3-footer-col">
          <h3>Get involved</h3>
          <p>
            Help make the map more accurate.{" "}
            <Link href="/get-involved">Share input</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
