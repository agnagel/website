"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { PROBLEM_AREAS, H2_IDEAS } from "../data/problemSpace";
import { HORIZONS, DOMAINS, type HorizonKey, type DomainKey } from "../data/horizons";

type Horizon = HorizonKey;
type Domain = DomainKey;
type DomainFilter = Domain | "all";

type Reform = {
  id: string;
  name: string;
  domain: Domain;
  horizon: Horizon;
  year: number;
  blurb: string;
  pattern: string;
  why: string;
  shift?: string;
};

type PositionedReform = Reform & {
  color: string;
  hlabel: string;
  hname: string;
  leftPct: number;
  topPx: number;
  size: number;
};

const YMIN = 2016;
const YMAX = 2042;

// Every dot on the map is sourced from the Google Sheet (via
// app/data/problemSpace.ts): H1 status quo and H3 vision points come from the
// "H1 & H3" problem areas, and the H2− / H2+ dots from the "H2 Problem Space"
// ideas. Nothing here is hand-written — re-run `npm run sync-system` to refresh.
function buildReforms(): Reform[] {
  const out: Reform[] = [];

  for (const area of PROBLEM_AREAS) {
    const domain = (area.domains[0] ?? "technology") as Domain;
    if (area.h1Statement) {
      out.push({
        id: `h1-${area.id}`,
        name: area.h1Statement,
        domain,
        horizon: "h1",
        year: area.h1Time ?? YMIN,
        blurb: area.h1Description,
        pattern: "",
        why: ""
      });
    }
    if (area.h3Statement) {
      out.push({
        id: `h3-${area.id}`,
        name: area.h3Statement,
        domain,
        horizon: "h3",
        year: area.h3Time ?? YMAX,
        blurb: area.h3Description,
        pattern: "",
        why: ""
      });
    }
  }

  for (const idea of H2_IDEAS) {
    const domain = (idea.domains[0] ?? "technology") as Domain;
    out.push({
      id: `h2-${idea.id}`,
      name: idea.solutionStatement,
      domain,
      horizon: idea.horizonKey as Horizon,
      year: idea.year ?? YMAX,
      blurb: idea.solutionDescription,
      pattern: idea.problemStatement,
      why: idea.horizonJustification || idea.problemDescription,
      shift: idea.pathToH2plus || undefined
    });
  }

  return out;
}

const ALL_REFORMS: Reform[] = buildReforms();

const XPAD = 6;
const XSPAN = 88;
const LANE_HEIGHT = 132;
const PLOT_HEIGHT = LANE_HEIGHT * 4;

function alpha(hex: string) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r},${g},${b},0.32)`;
}

function lighten(hex: string, t: number) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const mix = (value: number) => Math.round(value + (242 - value) * t);
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}

function luminance(hex: string) {
  const c = hex.replace("#", "");
  const channel = (value: string) => {
    const normalized = parseInt(value, 16) / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(c.slice(0, 2)) + 0.7152 * channel(c.slice(2, 4)) + 0.0722 * channel(c.slice(4, 6));
}

// Deterministic per-id hash in [0, 1) (FNV-1a with a seed). Keyed off each dot's
// id so its jitter is stable across renders and reloads; two different seeds
// give independent horizontal (year) and vertical scatter.
function hash01(id: string, seed: number): number {
  let h = seed >>> 0;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

// Keep dots this far from a lane's top/bottom edge (px).
const LANE_MARGIN = 15;
// Nominal plot width (px) used to space dots in the collision pass; positions
// are stored as % so they still scale, but overlap is resolved at this width.
const PLOT_W = 772;
const DRIFT_YEARS = 0.85; // most a dot may slide from its true year (each way)
const DOT_GAP = 1.5; // extra px kept between dot edges
const RELAX_ITERS = 140;

function yearToXpx(year: number): number {
  const pct = XPAD + ((year - YMIN) / (YMAX - YMIN)) * XSPAN;
  return (Math.min(XPAD + XSPAN, Math.max(XPAD, pct)) / 100) * PLOT_W;
}

function positionedReforms(): PositionedReform[] {
  const offsets = [-42, 30, -8, 44, -26, 12, -52, 4];
  const counts: Partial<Record<Horizon, number>> = {};

  // Initial placement: jitter each dot ±0.5yr horizontally and scatter it
  // vertically within its lane (structured offset + random). These become the
  // starting points for the collision relaxation below.
  const nodes = ALL_REFORMS.map((reform) => {
    const horizon = HORIZONS[reform.horizon];
    const index = counts[reform.horizon] ?? 0;
    counts[reform.horizon] = index + 1;

    const plotYear = reform.year + (hash01(reform.id, 0x811c9dc5) - 0.5);
    const laneTop = horizon.lane * LANE_HEIGHT;
    const laneCenter = laneTop + LANE_HEIGHT / 2;
    const y0 =
      laneCenter +
      offsets[index % offsets.length] * 0.4 +
      (hash01(reform.id, 0x9e3779b9) - 0.5) * 62;

    return {
      reform,
      horizon,
      x: yearToXpx(plotYear),
      y: Math.max(laneTop + LANE_MARGIN, Math.min(laneTop + LANE_HEIGHT - LANE_MARGIN, y0)),
      xMin: yearToXpx(reform.year - DRIFT_YEARS),
      xMax: yearToXpx(reform.year + DRIFT_YEARS),
      yMin: laneTop + LANE_MARGIN,
      yMax: laneTop + LANE_HEIGHT - LANE_MARGIN,
      r: (reform.horizon === "h3" ? 16 : 14) / 2
    };
  });

  // Relax overlaps: repeatedly push any pair of dots that are closer than their
  // combined radii apart. Horizontal movement is damped so dots keep their year;
  // vertical does most of the separating. Each dot stays clamped to its lane and
  // its ±DRIFT_YEARS band, so classification and year reading are preserved.
  for (let iter = 0; iter < RELAX_ITERS; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        const minD = a.r + b.r + DOT_GAP;
        const d2 = dx * dx + dy * dy;
        if (d2 >= minD * minD) continue;
        let d = Math.sqrt(d2);
        if (d < 1e-4) {
          // Near-coincident: separate straight up/down.
          dx = 0;
          dy = 1;
          d = 1;
        }
        const push = (minD - d) / 2;
        const ux = dx / d;
        const uy = dy / d;
        a.x -= ux * push * 0.55;
        b.x += ux * push * 0.55;
        a.y -= uy * push;
        b.y += uy * push;
        a.x = Math.max(a.xMin, Math.min(a.xMax, a.x));
        b.x = Math.max(b.xMin, Math.min(b.xMax, b.x));
        a.y = Math.max(a.yMin, Math.min(a.yMax, a.y));
        b.y = Math.max(b.yMin, Math.min(b.yMax, b.y));
      }
    }
  }

  return nodes.map(({ reform, horizon, x, y }) => ({
    ...reform,
    color: horizon.color,
    hlabel: horizon.label,
    hname: horizon.name,
    leftPct: Math.round((x / PLOT_W) * 1000) / 10,
    topPx: Math.round(y),
    size: reform.horizon === "h3" ? 16 : 14
  }));
}

export default function ReformMap() {
  const [activeDomain, setActiveDomain] = useState<DomainFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reforms = useMemo(positionedReforms, []);
  const selected = selectedId ? reforms.find((reform) => reform.id === selectedId) ?? null : null;
  const hovered = hoveredId ? reforms.find((reform) => reform.id === hoveredId) ?? null : null;
  const chips: Array<[DomainFilter, string]> = [["all", "All"], ...Object.entries(DOMAINS) as Array<[Domain, string]>];
  const yearToPct = (year: number) =>
    Math.round((XPAD + ((year - YMIN) / (YMAX - YMIN)) * XSPAN) * 10) / 10;
  const ticks = [2018, 2026, 2034, 2040].map((year) => ({ year, leftPct: yearToPct(year) }));
  const todayLeftPct = yearToPct(2026);

  return (
    <section id="reform-map" className="h3-map-page" aria-labelledby="reform-map-title">
      <section className="h3-map-intro">
        <p className="h3-map-kicker">Initial Reform Map</p>
        <h2 id="reform-map-title">Every reform effort faces the same question.</h2>
        <p>
          The map places reform ideas across time and across the Three Horizons.{" "}
          <strong>Click a dot</strong> to see the provisional classification and the
          reasoning. Challenge the call. Add missing examples. Help make the map sharper.{" "}
          <Link className="h3-map-intro-cta" href="/get-involved#h3-test">
            Test your idea against the third horizon&nbsp;
            <span aria-hidden="true">→</span>
          </Link>
        </p>
        <p className="h3-source-note">
          Ideas are sourced from interviews and existing literature, and are not
          necessarily originated by POPVOX Foundation.
        </p>
      </section>

      <section className="h3-map-filters" aria-label="Domain filters">
        <span>Domain</span>
        {chips.map(([key, label]) => (
          <button
            className={activeDomain === key ? "is-active" : undefined}
            key={key}
            onClick={() => setActiveDomain(key)}
            type="button"
          >
            {label}
          </button>
        ))}
      </section>

      <section className="h3-map-workspace">
        <div className="h3-map-chart-shell">
          <div className="h3-map-chart-grid">
            <div className="h3-map-lanes" aria-hidden="true">
              <Lane label="H3" color="var(--h3)" />
              <Lane label="H2+" color="var(--h2pos)" dashed />
              <Lane label="H2−" color="var(--h2neg)" />
              <Lane label="H1" color="var(--h1)" last />
            </div>

            <div className="h3-map-plot-wrap">
              <div
                className="h3-map-plot"
                style={{ height: PLOT_HEIGHT, "--today-left": `${todayLeftPct}%` } as CSSProperties}
              >
                <div className="h3-map-band h3-map-band-h3" />
                <div className="h3-map-band h3-map-band-h2pos" />
                <div className="h3-map-band h3-map-band-h2neg" />
                <div className="h3-map-band h3-map-band-h1" />
                <div className="h3-map-fork-line" />
                <div className="h3-map-fork-up">↑ BUILDS TOWARD H3</div>
                <div className="h3-map-fork-down">↓ SUSTAINS H1</div>
                <div className="h3-map-today-line" />
                <div className="h3-map-today-label">TODAY</div>

                {reforms.map((reform) => {
                  const dimmed = activeDomain !== "all" && reform.domain !== activeDomain;
                  const selectedDot = selectedId === reform.id;
                  return (
                    <button
                      aria-label={reform.name}
                      className="h3-map-dot"
                      disabled={dimmed}
                      key={reform.id}
                      onClick={() => setSelectedId(selectedDot ? null : reform.id)}
                      onMouseEnter={() => {
                        if (!dimmed) setHoveredId(reform.id);
                      }}
                      onMouseLeave={() => setHoveredId(null)}
                      style={
                        {
                          "--dot-color": reform.color,
                          "--dot-left": `${reform.leftPct}%`,
                          "--dot-top": `${reform.topPx}px`,
                          "--dot-size": `${reform.size}px`,
                          "--dot-opacity": dimmed ? 0.1 : 1,
                          "--dot-shadow": selectedDot
                            ? `0 0 0 4px ${alpha(reform.color)}`
                            : "0 1px 3px rgba(20,37,58,.25)",
                          "--dot-z": selectedDot ? 7 : 2
                        } as CSSProperties
                      }
                      type="button"
                    />
                  );
                })}

                {hovered && (
                  <div
                    className="h3-map-tooltip"
                    style={
                      {
                        "--tooltip-left": `${hovered.leftPct}%`,
                        "--tooltip-top": `${hovered.topPx}px`,
                        "--tooltip-color": hovered.color,
                        "--tooltip-label": lighten(hovered.color, 0.5)
                      } as CSSProperties
                    }
                  >
                    <span className="h3-tt-dot" />
                    {hovered.name}
                    <strong>{hovered.hlabel}</strong>
                  </div>
                )}
              </div>

              <div className="h3-map-axis" aria-hidden="true">
                {ticks.map((tick) => (
                  <span
                    className={tick.year === 2026 ? "is-today" : undefined}
                    key={tick.year}
                    style={{ left: `${tick.leftPct}%` }}
                  >
                    {tick.year}
                  </span>
                ))}
                <strong>time →</strong>
              </div>
            </div>
          </div>
        </div>

        <aside className="h3-map-side">
          {selected ? (
            <DetailPanel reform={selected} onClose={() => setSelectedId(null)} />
          ) : (
            <ReadMapPanel />
          )}
          <p className="h3-map-note">
            This is a public draft. Future updates will add examples, refine classifications,
            and incorporate feedback.
          </p>
        </aside>
      </section>
    </section>
  );
}

function Lane({
  label,
  color,
  dashed,
  last
}: {
  label: string;
  color: string;
  dashed?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`h3-map-lane ${dashed ? "is-dashed" : ""} ${last ? "is-last" : ""}`}>
      <strong style={{ color }}>{label}</strong>
    </div>
  );
}

function DetailPanel({ reform, onClose }: { reform: PositionedReform; onClose: () => void }) {
  const labelColor = lighten(reform.color, 0.5);
  const badgeText = luminance(reform.color) > 0.4 ? "#14253A" : "#F4EFE6";

  return (
    <div className="h3-map-detail">
      <div className="h3-map-detail-top">
        <span style={{ background: reform.color, color: badgeText }}>
          {reform.hlabel} · {reform.hname}
        </span>
        <button aria-label="Close reform detail" onClick={onClose} type="button">
          ×
        </button>
      </div>
      <h2>{reform.name}</h2>
      <div className="h3-map-detail-meta">
        <span>{DOMAINS[reform.domain]}</span>
        <span>·</span>
        <span>{reform.year}</span>
      </div>
      {reform.blurb && <p>{reform.blurb}</p>}
      {reform.why && (
        <div className="h3-map-why">
          <h3 style={{ color: labelColor }}>
            {reform.pattern ? `Why it sits here · ${reform.pattern}` : "Why it sits here"}
          </h3>
          <p>{reform.why}</p>
        </div>
      )}
      {reform.shift && (
        <div className="h3-map-shift">
          <h3>↑ How it could become H2+</h3>
          <p>{reform.shift}</p>
        </div>
      )}
    </div>
  );
}

function ReadMapPanel() {
  return (
    <div className="h3-map-reader">
      <h2>How to read this map</h2>
      <div>
        <LegendItem color="var(--h3)" title="H3" copy="capabilities Congress will need for the decade ahead." />
        <LegendItem color="var(--h2pos)" title="H2+" copy="reforms that change the underlying conditions." />
        <LegendItem color="var(--h2neg)" title="H2−" copy="reforms that relieve pressure but preserve today's system." />
        <LegendItem color="var(--h1)" title="H1" copy="the inherited operating model as it runs today." />
      </div>
      <p>
        The fork at the center separates <span className="h3-h2neg">H2−</span> from{" "}
        <span className="h3-h2pos-dark">H2+</span>: reforms that sustain H1 from reforms that
        build toward H3.
      </p>
    </div>
  );
}

function LegendItem({ color, title, copy }: { color: string; title: string; copy: string }) {
  return (
    <div className="h3-map-legend-item">
      <span style={{ background: color }} />
      <p>
        <strong>{title}</strong> — {copy}
      </p>
    </div>
  );
}
