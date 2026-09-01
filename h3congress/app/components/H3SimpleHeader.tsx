import Link from "next/link";

export default function H3SimpleHeader() {
  return (
    <nav className="h3-nav h3-simple-nav" aria-label="Primary navigation">
      <Link className="h3-brand" href="/">
        <img src="/assets/h3-logo.png" alt="H3 Congress" />
        <span>A Three Horizons Vision for Congress</span>
      </Link>
      <div className="h3-nav-links">
        <Link href="/">
          <span aria-hidden="true">←</span> Back to Overview
        </Link>
        <Link href="/#reform-map">Reform Map</Link>
        <Link className="h3-nav-cta" href="/#involved">
          Get involved
        </Link>
      </div>
    </nav>
  );
}
