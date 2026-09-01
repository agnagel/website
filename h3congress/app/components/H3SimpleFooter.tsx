import Link from "next/link";

export default function H3SimpleFooter() {
  return (
    <footer className="h3-footer">
      <div className="h3-container">
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
        <div className="h3-footer-grid">
          <div>
            <img className="h3-footer-mark" src="/assets/h3-logo.png" alt="H3 Congress" />
            <p>
              An interactive project mapping the structural capacity gap in the legislative
              branch, built in public by POPVOX Foundation.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/">Overview</Link>
            <Link href="/what-is-h3">What is Horizon 3?</Link>
            <Link href="/#reform-map">Reform Map</Link>
          </div>
          <div>
            <h3>Get involved</h3>
            <p>
              Help make the map more accurate. <Link href="/#involved">Share input</Link> as the
              work develops.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
