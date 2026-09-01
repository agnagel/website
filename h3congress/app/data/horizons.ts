// Canonical metadata for the Three Horizons and the five domains — the single
// source of truth the UI reads from, so a label, color, or lane is defined once
// and can never drift between the Reform Map, the Domains tab, and the diagram.
//
// Domain *labels* originate in the sheet-generated data module (problemSpace.ts);
// they are re-exported here so UI code has one import for both concepts.

import { DOMAIN_LABELS, type DomainKey } from "./problemSpace";

export type HorizonKey = "h1" | "h2neg" | "h2pos" | "h3";

type HorizonMeta = {
  key: HorizonKey;
  /** Short badge, e.g. "H2−". */
  label: string;
  /** One-line gloss, e.g. "Builds toward H3". */
  name: string;
  /** Plot color used by the Reform Map dots/lanes. */
  color: string;
  /** Reform Map vertical lane (0 = top / H3). */
  lane: number;
  /** CSS modifier class used by the Domains tab chips (`is-h1` …). */
  className: string;
};

export const HORIZONS: Record<HorizonKey, HorizonMeta> = {
  h1: { key: "h1", label: "H1", name: "The system today", color: "#8fa2ba", lane: 3, className: "is-h1" },
  h2neg: { key: "h2neg", label: "H2−", name: "Sustains H1", color: "#eaa63c", lane: 2, className: "is-h2neg" },
  h2pos: { key: "h2pos", label: "H2+", name: "Builds toward H3", color: "#34b877", lane: 1, className: "is-h2pos" },
  h3: { key: "h3", label: "H3", name: "The future system", color: "#1de2ff", lane: 0, className: "is-h3" }
};

// The compact { label, className } pair the Domains tab uses for its horizon
// chips, with a graceful fallback for any unexpected key.
export function horizonChip(key: string): { label: string; className: string } {
  const h = HORIZONS[key as HorizonKey];
  return h ? { label: h.label, className: h.className } : { label: key, className: "is-h1" };
}

// Domain display names live in the generated module (the sheet is authoritative);
// re-exported so consumers import domain + horizon metadata from one place.
export { DOMAIN_LABELS, type DomainKey };
export const DOMAINS = DOMAIN_LABELS;
