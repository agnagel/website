"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { PROBLEM_AREAS, H2_IDEAS } from "../../data/problemSpace";
import {
  BUCKETS,
  bucketLabel,
  bucketNodeTitle
} from "../../data/systemDiagram";
import { ProblemSpaceModal } from "./ProblemSpaceModal";
import { buildProblemSpaceGroups } from "./problemSpaceGroups";

// The dark diagram palette, applied as CSS custom properties on the stage. The
// original System Diagram set these inline; keeping them here preserves its look.
const STAGE_VARS: CSSProperties = {
  ["--bg" as string]: "#05080d",
  ["--ink" as string]: "#dcebef",
  ["--dim" as string]: "#6f97a4",
  ["--accent" as string]: "#00eedd",
  ["--feedback" as string]: "#d7a13a",
  ["--panel" as string]: "rgba(11,24,32,.5)",
  ["--cardbg" as string]: "rgba(8,20,28,.55)",
  ["--core" as string]: "#0a1a22",
  ["--line" as string]: "#2c5f68",
  ["--title" as string]: "#f4ecdc",
  ["--glow" as string]: "drop-shadow(0 0 4px rgba(0,238,221,.45))",
  position: "relative",
  width: 1520,
  height: 785,
  overflow: "hidden",
  background: "var(--bg)",
  fontFamily: "'Inter Tight',sans-serif",
  margin: "0 auto"
};

function Icon({
  id,
  size,
  color,
  strokeWidth = 1.7
}: {
  id: string;
  size: number;
  color: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color, flex: "none" }}
    >
      <use href={`#${id}`} />
    </svg>
  );
}

// A "list card" block used by the Democratic Input and Institutional Outputs
// panels. `big` is the emphasized Legislation card; `sub` adds the mono caption.
function ListBlock({
  icon,
  label,
  count,
  height,
  onClick,
  iconColor = "var(--accent)",
  sub,
  big = false
}: {
  icon: string;
  label: string;
  count: number;
  height: number;
  onClick: () => void;
  iconColor?: string;
  sub?: string;
  big?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex",
        alignItems: sub ? "flex-start" : "center",
        gap: 13,
        border: big ? "1.5px solid var(--line)" : "1px solid var(--line)",
        background: "var(--cardbg)",
        padding: sub ? "13px 14px" : "0 14px",
        height,
        width: "100%",
        cursor: "pointer",
        textAlign: "left"
      }}
    >
      <Icon
        id={icon}
        size={big ? 27 : 25}
        color={iconColor}
        strokeWidth={1.7}
      />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: big ? 16 : 15,
            fontWeight: big ? 700 : 600,
            color: "var(--ink)"
          }}
        >
          {label}{" "}
          <span style={{ color: "var(--dim)", fontWeight: 500 }}>({count})</span>
        </div>
        {sub && (
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 10,
              lineHeight: 1.5,
              color: "var(--dim)",
              marginTop: 5
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </button>
  );
}

// The three small rectangular blocks in the Institution's top and bottom rows.
function InstBlock({
  icon,
  label,
  count,
  style,
  onClick
}: {
  icon: string;
  label: string;
  count: number;
  style: CSSProperties;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        border: "1px solid var(--line)",
        background: "var(--cardbg)",
        padding: "8px 12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 3,
        zIndex: 2,
        cursor: "pointer",
        alignItems: "flex-start",
        textAlign: "left",
        ...style
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Icon id={icon} size={19} color="var(--dim)" />
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
          {label}{" "}
          <span style={{ color: "var(--dim)", fontWeight: 500 }}>({count})</span>
        </div>
      </div>
    </button>
  );
}

// One of the round core seams (District Offices, DC Offices, Committees).
function CircleBlock({
  icon,
  label,
  count,
  top,
  onClick
}: {
  icon: string;
  label: string;
  count: number;
  top: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="h3-diagram-seam"
      style={{
        position: "absolute",
        left: 277,
        top,
        width: 76,
        height: 76,
        border: "1.5px solid var(--accent)",
        background: "var(--core)",
        borderRadius: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        zIndex: 5,
        filter: "var(--glow)",
        cursor: "pointer"
      }}
    >
      <Icon id={icon} size={18} color="var(--accent)" />
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "var(--accent)",
          textAlign: "center",
          lineHeight: 1.05
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 500,
          color: "var(--dim)",
          textAlign: "center",
          lineHeight: 1,
          marginTop: 2
        }}
      >
        ({count})
      </div>
    </button>
  );
}

export default function SystemDiagramTab() {
  const [activeBucket, setActiveBucket] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Every block as a modal group, plus the "(N)" count on each block title. The
  // shared builder derives both by grouping the problem space on `area.buckets`,
  // exactly as the Domains tab groups on `area.domains`.
  const { groups, countByKey } = useMemo(
    () =>
      buildProblemSpaceGroups(
        (area) => area.buckets,
        Object.keys(BUCKETS),
        (key) => ({
          title: bucketLabel(key),
          lede: BUCKETS[key].blurb,
          eyebrowLabel: bucketNodeTitle(key),
          note: BUCKETS[key].note
        })
      ),
    []
  );

  const count = (bucket: string) => countByKey.get(bucket) ?? 0;
  const open = (bucket: string) => () => setActiveBucket(bucket);

  // Toggle the edge fades + "scroll to explore" hint based on how far the
  // horizontal diagram scroller is scrolled (the 1520px stage overflows on
  // narrower viewports).
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const scroller = wrap.querySelector<HTMLElement>(".h3-scroller");
    if (!scroller) return;
    const update = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      wrap.setAttribute("data-l", scroller.scrollLeft > 4 ? "1" : "0");
      wrap.setAttribute(
        "data-r",
        max > 4 && scroller.scrollLeft < max - 4 ? "1" : "0"
      );
    };
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    const t = setTimeout(update, 300);
    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      clearTimeout(t);
    };
  }, []);

  return (
    <section className="h3-sysdiagram" aria-label="Congress system diagram">
      <div className="h3-sysdiagram-intro">
        <p className="h3-eyebrow h3-eyebrow-gold">The Legislative Cycle</p>
        <h2>Congress as an Information System</h2>
        <p>
          The blocks shown are the most common and time-consuming activities
          today&rsquo;s Congress conducts. Select any highlighted block to surface the
          problems with today&rsquo;s Congress — and, for each, the solutions that range
          from near-term workarounds to the end-state vision.
        </p>
        <p className="h3-source-note">
          Ideas are sourced from interviews and existing literature, and are not
          necessarily originated by POPVOX Foundation.
        </p>
      </div>

      <div className="h3-scrollwrap" ref={wrapRef}>
        <div className="h3-scroller">
          <div className="h3-diagram" style={STAGE_VARS}>
            {/* Icon symbol library */}
            <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
              <defs>
                <symbol id="ic-folder" viewBox="0 0 24 24"><path d="M3 7c0-.8.7-1.5 1.5-1.5H9l2 2h8.5c.8 0 1.5.7 1.5 1.5v8c0 .8-.7 1.5-1.5 1.5h-15C3.7 18.5 3 17.8 3 17z" /></symbol>
                <symbol id="ic-people" viewBox="0 0 24 24"><circle cx="9" cy="8" r="2.4" /><circle cx="16" cy="9" r="2" /><path d="M4 18.5c0-2.8 2.2-4.6 5-4.6 1.4 0 2.7.5 3.6 1.3" /><path d="M13.6 14.2c.6-.3 1.5-.5 2.4-.5 2.3 0 4 1.5 4 3.9" /></symbol>
                <symbol id="ic-chat" viewBox="0 0 24 24"><path d="M4 5.5h12c.8 0 1.5.7 1.5 1.5v6c0 .8-.7 1.5-1.5 1.5H9l-3.5 3v-3H4c-.8 0-1.5-.7-1.5-1.5V7c0-.8.7-1.5 1.5-1.5z" /><path d="M7 9.5h6M7 12h4" /></symbol>
                <symbol id="ic-dots" viewBox="0 0 24 24"><circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="none" /></symbol>
                <symbol id="ic-columns" viewBox="0 0 24 24"><path d="M3.5 9 12 4l8.5 5" /><path d="M5.5 9.5v8M9.2 9.5v8M14.8 9.5v8M18.5 9.5v8" /><path d="M4 17.5h16M3 20h18" /></symbol>
                <symbol id="ic-dome" viewBox="0 0 24 24"><path d="M5 19c0-5 3-8.5 7-8.5s7 3.5 7 8.5" /><path d="M12 10.5V6.5" /><circle cx="12" cy="5" r="1.2" /><path d="M4 19h16" /><path d="M8.5 11v8M15.5 11v8" /></symbol>
                <symbol id="ic-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 3.5v2.6M12 17.9v2.6M3.5 12h2.6M17.9 12h2.6M5.9 5.9l1.9 1.9M16.2 16.2l1.9 1.9M18.1 5.9l-1.9 1.9M7.8 16.2l-1.9 1.9" /></symbol>
                <symbol id="ic-flag" viewBox="0 0 24 24"><path d="M6 3.5v17" /><path d="M6 4.5h11l-2.3 3.3L17 11H6z" /></symbol>
                <symbol id="ic-person" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3" /><path d="M5.5 20c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2" /></symbol>
                <symbol id="ic-clip" viewBox="0 0 24 24"><rect x="5.5" y="5" width="13" height="15" rx="1.5" /><rect x="9" y="3" width="6" height="3.2" rx="1" /><path d="M9 10.5h6M9 13.5h6M9 16.5h3.5" /></symbol>
                <symbol id="ic-chip" viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" /></symbol>
                <symbol id="ic-dollar" viewBox="0 0 24 24"><path d="M12 3v18" /><path d="M16.5 6.8c0-1.9-2-3.3-4.5-3.3S7.5 4.9 7.5 6.8s2 3.2 4.5 3.5 4.5 1.6 4.5 3.5-2 3.4-4.5 3.4-4.5-1.4-4.5-3.4" /></symbol>
                <symbol id="ic-bill" viewBox="0 0 24 24"><path d="M6 3.5h9l4 4v13H6z" /><path d="M15 3.5v4h4" /><path d="M9 12h6M9 15h6M9 18h4" /></symbol>
                <symbol id="ic-eye" viewBox="0 0 24 24"><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.6" /></symbol>
                <symbol id="ic-broadcast" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" /><path d="M8.2 8.2a5.4 5.4 0 000 7.6M15.8 8.2a5.4 5.4 0 010 7.6M5.6 5.6a9 9 0 000 12.8M18.4 5.6a9 9 0 010 12.8" /></symbol>
                <symbol id="ic-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" /><path d="M8.3 12.2l2.4 2.4 5-5.2" /></symbol>
                <symbol id="ic-userdone" viewBox="0 0 24 24"><circle cx="9.5" cy="8" r="3.2" /><path d="M4 18.5c0-3 2.5-5.2 5.5-5.2 1.1 0 2.1.3 3 .8" /><path d="M13.8 17.2l1.9 1.9 3.6-4" /></symbol>
                <symbol id="ic-vote" viewBox="0 0 24 24"><rect x="4.5" y="5" width="15" height="14" rx="1.5" /><path d="M8 12l2.6 2.6L16 9" /></symbol>
                <symbol id="ic-pin" viewBox="0 0 24 24"><path d="M12 21c3.5-4.5 5.5-7.5 5.5-10.5a5.5 5.5 0 10-11 0c0 3 2 6 5.5 10.5z" /><circle cx="12" cy="10" r="2" /></symbol>
                <symbol id="ic-org" viewBox="0 0 24 24"><rect x="9" y="3.5" width="6" height="4.5" rx="1" /><rect x="3" y="15.5" width="6" height="4.5" rx="1" /><rect x="15" y="15.5" width="6" height="4.5" rx="1" /><path d="M12 8V13M6 15.5V13H18V15.5" /></symbol>
              </defs>
            </svg>

            {/* LEGEND */}
            <div style={{ position: "absolute", right: 60, top: 30, display: "flex", flexDirection: "column", gap: 9, zIndex: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="46" height="10"><line x1="2" y1="5" x2="36" y2="5" stroke="var(--accent)" strokeWidth="2.4" /><path d="M36 1 L44 5 L36 9 Z" fill="var(--accent)" /></svg>
                <span style={{ fontSize: 11.5, letterSpacing: ".06em", color: "var(--ink)" }}>Forward flow</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="46" height="10"><line x1="2" y1="5" x2="36" y2="5" stroke="var(--feedback)" strokeWidth="2.4" strokeDasharray="5 4" /><path d="M36 1 L44 5 L36 9 Z" fill="var(--feedback)" /></svg>
                <span style={{ fontSize: 11.5, letterSpacing: ".06em", color: "var(--ink)" }}>Feedback loop</span>
              </div>
            </div>

            {/* ════ DEMOCRATIC INPUT ════ */}
            <div style={{ position: "absolute", left: 60, top: 150, width: 290, height: 554, border: "1px solid var(--line)", background: "var(--panel)", padding: 18, zIndex: 3 }}>
              <div style={{ fontFamily: "'Libre Caslon Text',serif", fontSize: 21, color: "var(--title)", margin: "0 0 16px" }}>Democratic Input</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <ListBlock icon="ic-vote" label="Elections" count={count("elections")} height={55} onClick={open("elections")} />
                <ListBlock icon="ic-chat" label="Constituent Engagement" count={count("community")} height={55} onClick={open("community")} />
                <ListBlock icon="ic-people" label="Stakeholder Engagement" count={count("stakeholder")} height={55} onClick={open("stakeholder")} />
                <ListBlock icon="ic-dollar" label="Funding Requests" count={count("appropriationsRequests")} height={55} onClick={open("appropriationsRequests")} />
                <ListBlock icon="ic-folder" label="Casework" count={count("casework")} height={55} onClick={open("casework")} />
                <ListBlock icon="ic-dots" iconColor="var(--dim)" label="Other Services" count={count("otherServices")} height={96} sub="Service academy nominations · tour requests · flag requests" onClick={open("otherServices")} />
              </div>
            </div>

            {/* ════ INSTITUTION ════ */}
            <div style={{ position: "absolute", left: 450, top: 150, width: 630, height: 554, border: "1px solid var(--line)", background: "var(--panel)", zIndex: 3 }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 14, textAlign: "center", zIndex: 2 }}>
                <div style={{ fontFamily: "'Libre Caslon Text',serif", fontSize: 21, color: "var(--title)" }}>The Institution</div>
              </div>
              {/* TOP ROW */}
              <InstBlock icon="ic-people" label="Members" count={count("members")} onClick={open("members")} style={{ left: 15, top: 56, width: 186, height: 64 }} />
              <InstBlock icon="ic-org" label="Structure" count={count("structure")} onClick={open("structure")} style={{ left: 222, top: 56, width: 186, height: 64 }} />
              <InstBlock icon="ic-clip" label="Processes" count={count("processes")} onClick={open("processes")} style={{ left: 429, top: 56, width: 186, height: 64 }} />
              {/* CORE: House / Senate */}
              <button onClick={open("house")} style={{ position: "absolute", left: 35, top: 142, width: 276, height: 293, border: "1px solid var(--accent)", background: "var(--core)", borderRadius: "8px 0 0 8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 7, filter: "var(--glow)", zIndex: 2, cursor: "pointer" }}>
                <Icon id="ic-columns" size={26} color="var(--accent)" strokeWidth={1.6} />
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", textAlign: "center", lineHeight: 1.15, maxWidth: 160 }}>House of Representatives <span style={{ color: "var(--dim)", fontWeight: 500 }}>({count("house")})</span></div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "var(--dim)" }}>Closer to the people</div>
              </button>
              <button onClick={open("senate")} style={{ position: "absolute", left: 319, top: 142, width: 276, height: 293, border: "1px solid var(--accent)", background: "var(--core)", borderRadius: "0 8px 8px 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 7, filter: "var(--glow)", zIndex: 2, cursor: "pointer" }}>
                <Icon id="ic-dome" size={26} color="var(--accent)" strokeWidth={1.6} />
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", textAlign: "center" }}>Senate <span style={{ color: "var(--dim)", fontWeight: 500 }}>({count("senate")})</span></div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "var(--dim)" }}>More deliberative</div>
              </button>
              {/* Support Agencies straddling the bottom seam */}
              <button onClick={open("supportAgencies")} className="h3-diagram-seam" style={{ position: "absolute", left: 155, top: 407, width: 320, height: 56, border: "1px solid var(--accent)", background: "var(--core)", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, zIndex: 4, filter: "var(--glow)", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <Icon id="ic-gear" size={21} color="var(--accent)" strokeWidth={1.6} />
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Support Agencies <span style={{ color: "var(--dim)", fontWeight: 500 }}>({count("supportAgencies")})</span></div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "var(--dim)" }}>CBO · CRS · GAO</div>
              </button>
              {/* Round seams */}
              <CircleBlock icon="ic-pin" label="District Offices" count={count("districtOffices")} top={150} onClick={open("districtOffices")} />
              <CircleBlock icon="ic-org" label="DC Offices" count={count("dcOffices")} top={236} onClick={open("dcOffices")} />
              <CircleBlock icon="ic-people" label="Committees" count={count("committees")} top={322} onClick={open("committees")} />
              {/* BOTTOM ROW */}
              <InstBlock icon="ic-person" label="Personnel" count={count("personnel")} onClick={open("personnel")} style={{ left: 15, top: 478, width: 186, height: 58 }} />
              <InstBlock icon="ic-flag" label="Culture" count={count("culture")} onClick={open("culture")} style={{ left: 222, top: 478, width: 186, height: 58 }} />
              <InstBlock icon="ic-chip" label="Technology" count={count("technology")} onClick={open("technology")} style={{ left: 429, top: 478, width: 186, height: 58 }} />
            </div>

            {/* ════ LEGISLATIVE OUTPUTS ════ */}
            <div style={{ position: "absolute", left: 1180, top: 150, width: 280, height: 554, border: "1px solid var(--line)", background: "var(--panel)", padding: 18, zIndex: 3 }}>
              <div style={{ fontFamily: "'Libre Caslon Text',serif", fontSize: 21, color: "var(--title)", margin: "0 0 16px" }}>Institutional Outputs</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <ListBlock icon="ic-bill" label="Legislation" count={count("law")} height={70} big onClick={open("law")} />
                <ListBlock icon="ic-dollar" label="Appropriations" count={count("appropriations")} height={52} onClick={open("appropriations")} />
                <ListBlock icon="ic-check" label="Confirmations" count={count("confirmations")} height={52} onClick={open("confirmations")} />
                <ListBlock icon="ic-broadcast" label="Communications" count={count("communications")} height={52} onClick={open("communications")} />
                <ListBlock icon="ic-eye" label="Oversight" count={count("oversight")} height={52} onClick={open("oversight")} />
                <ListBlock icon="ic-userdone" label="Constituent Outcomes" count={count("constituentOutcomes")} height={52} onClick={open("constituentOutcomes")} />
                <ListBlock icon="ic-dots" iconColor="var(--dim)" label="Other Activities" count={count("otherActivities")} height={84} sub="Honors · electoral duties · impeachments · treaties" onClick={open("otherActivities")} />
              </div>
            </div>

            {/* ════ CONNECTORS ════ */}
            <svg viewBox="0 0 1520 785" width="1520" height="785" style={{ position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none" }} fill="none">
              <defs>
                <marker id="fwd" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="var(--accent)" /></marker>
                <marker id="fb" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="var(--feedback)" /></marker>
              </defs>
              {/* forward flow */}
              <line x1="354" y1="416" x2="446" y2="416" stroke="var(--accent)" strokeWidth="3.4" markerEnd="url(#fwd)" />
              <line x1="1084" y1="416" x2="1176" y2="416" stroke="var(--accent)" strokeWidth="3.4" markerEnd="url(#fwd)" />
              <text x="400" y="401" textAnchor="middle" fill="var(--accent)" fontFamily="'Inter Tight',sans-serif" fontSize="11.5" fontWeight="700" letterSpacing="1.5">INFORMS</text>
              <text x="1130" y="401" textAnchor="middle" fill="var(--accent)" fontFamily="'Inter Tight',sans-serif" fontSize="11.5" fontWeight="700" letterSpacing="1.5">PRODUCES</text>
              {/* elections -> members */}
              <path d="M332 237 L463 237" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#fwd)" fill="none" />
              <text x="397" y="227" textAnchor="middle" fill="var(--accent)" fontFamily="'Inter Tight',sans-serif" fontSize="10.5" letterSpacing="1.2">ELECT</text>
              {/* feedback loops */}
              <g>
                <path d="M1440 209 L1440 112 C1440 100 1430 100 1418 100 L788 100 C775 100 765 110 765 150" stroke="var(--feedback)" strokeWidth="3" strokeDasharray="9 6" markerEnd="url(#fb)" style={{ animation: "h3flow 1.1s linear infinite" }} />
                <rect x="918" y="94" width="340" height="14" fill="var(--bg)" />
                <text x="1088" y="101" textAnchor="middle" fill="var(--feedback)" fontFamily="'Inter Tight',sans-serif" fontSize="13.5" letterSpacing="1.4" fontWeight="700">LEGISLATION RESHAPES THE INSTITUTION</text>
                <path d="M1198 501 L1080 501" stroke="var(--feedback)" strokeWidth="1.8" strokeDasharray="6 5" markerEnd="url(#fb)" style={{ animation: "h3flow 1.3s linear infinite" }} />
                <rect x="1112" y="483" width="56" height="14" fill="var(--bg)" />
                <text x="1140" y="494" textAnchor="middle" fill="var(--feedback)" fontFamily="'Inter Tight',sans-serif" fontSize="10.5" letterSpacing="1">FINDINGS</text>
                <path d="M1198 315 C1150 315 1116 314 1080 314" stroke="var(--feedback)" strokeWidth="1.8" strokeDasharray="6 5" markerEnd="url(#fb)" style={{ animation: "h3flow 1.3s linear infinite" }} />
                <rect x="1118" y="298" width="44" height="15" fill="var(--bg)" />
                <text x="1140" y="309" textAnchor="middle" fill="var(--feedback)" fontFamily="'Inter Tight',sans-serif" fontSize="10.5" letterSpacing="1">FUNDS</text>
                <path d="M1320 704 L1320 757 C1320 770 1311 776 1297 776 L221 776 C208 776 205 769 205 756 L205 704" stroke="var(--feedback)" strokeWidth="2.2" strokeDasharray="7 6" markerEnd="url(#fb)" style={{ animation: "h3flow 1.3s linear infinite" }} />
                <rect x="505" y="767" width="492" height="18" fill="var(--bg)" />
                <text x="751" y="780" textAnchor="middle" fill="var(--feedback)" fontFamily="'Inter Tight',sans-serif" fontSize="12.5" letterSpacing="1.4" fontWeight="600">OUTCOMES RETURN TO THE PUBLIC → SHAPES PUBLIC PERCEPTION</text>
              </g>
            </svg>
          </div>
        </div>
        <div className="h3-fade h3-fade-l" aria-hidden="true" />
        <div className="h3-fade h3-fade-r" aria-hidden="true" />
        <div className="h3-scrollhint" aria-hidden="true">
          <span>Scroll to explore</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
        </div>
      </div>

      {activeBucket && BUCKETS[activeBucket] && (
        <ProblemSpaceModal
          groups={groups}
          activeGroupId={activeBucket}
          allAreas={PROBLEM_AREAS}
          allIdeas={H2_IDEAS}
          theme="dark"
          onClose={() => setActiveBucket(null)}
        />
      )}
    </section>
  );
}
