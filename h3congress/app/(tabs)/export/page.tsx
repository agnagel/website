import ExportMotion from "./ExportMotion";
import BinaryRain from "./BinaryRain";

export const metadata = {
  title: "Export the data · H3 Congress"
};

export default function ExportPage() {
  return (
    <section className="h3-export">
      <ExportMotion />
      <BinaryRain />

      <div className="h3-container">
        <p className="h3-eyebrow h3-eyebrow-gold">Download the data</p>
        <h1>Export the Three Horizons Vision for Congress dataset</h1>
        <p className="h3-export-lede">
          Download a ZIP file, a single compressed folder, holding two
          spreadsheet files (CSV format, which opens in Excel, Numbers, or Google
          Sheets). It always reflects the latest data on the site, but remember to
          come back and check for updates!
        </p>

        <ul className="h3-export-list">
          <li>
            <strong>H1-and-H3.csv</strong> — the horizon pairs. Each row pairs a
            Horizon&nbsp;1 statement (how things work today, the status quo) with
            its matching Horizon&nbsp;3 statement, the future being aimed for.
          </li>
          <li>
            <strong>H2-Database.csv</strong> — the ideas in between. Every
            Horizon&nbsp;2 idea: both H2− moves that relieve pressure on
            today&rsquo;s system and H2+ moves that build toward the future
            vision.
          </li>
        </ul>

        <div className="h3-export-link">
          <h2>How the two files connect</h2>
          <p>
            Every idea in <strong>H2-Database.csv</strong> lists a value in
            its <strong>H1/H3 ID(s)</strong> column. That value matches the{" "}
            <strong>ID</strong> column in <strong>H1-and-H3.csv</strong>, so you
            can see which horizon pair any idea belongs to.
          </p>
        </div>

        <a
          className="h3-export-download"
          href="/exports/h3-congress-data.zip"
          download="h3-congress-data.zip"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v12" />
            <path d="M8 11l4 4 4-4" />
            <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
          </svg>
          Download ZIP
        </a>
      </div>
    </section>
  );
}
