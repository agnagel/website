import {
  PROBLEM_AREAS,
  H2_IDEAS,
  type ProblemArea
} from "../../data/problemSpace";
import type { ProblemSpaceGroup } from "./ProblemSpaceModal";

// Per-group display copy — everything in a ProblemSpaceGroup except its id and
// the areas (which this builder derives).
export type GroupMeta = {
  title: string;
  lede: string;
  eyebrowLabel: string;
  note?: string;
};

/**
 * Partition the shared problem space — the H1→H3 areas and the H2 ideas under
 * them — into named groups along one dimension. The Domains tab groups by
 * `area.domains`; the System Diagram groups by `area.buckets`. Both group the
 * same data the same way, so only `keyOf` (area → group keys), the display
 * `order`, and the per-key `metaFor` copy differ; everything else lives here.
 *
 * Returns the full set of groups (so a modal can move an idea to its own group)
 * plus a per-group count of the distinct H2−/H2+ ideas that group reveals. An
 * idea counts toward a group via the area(s) it addresses (idea.h1h3Ids → area
 * → key), NOT its own tags, so the count matches exactly what opens.
 */
export function buildProblemSpaceGroups(
  keyOf: (area: ProblemArea) => string[],
  order: string[],
  metaFor: (key: string) => GroupMeta
): { groups: ProblemSpaceGroup[]; countByKey: Map<string, number> } {
  const keysByArea = new Map<string, string[]>();
  const areasByKey = new Map<string, ProblemArea[]>();
  for (const area of PROBLEM_AREAS) {
    const keys = keyOf(area);
    keysByArea.set(area.id, keys);
    for (const key of keys) {
      if (!areasByKey.has(key)) areasByKey.set(key, []);
      areasByKey.get(key)!.push(area);
    }
  }

  const idsByKey = new Map<string, Set<string>>();
  for (const idea of H2_IDEAS) {
    if (idea.horizonKey !== "h2neg" && idea.horizonKey !== "h2pos") continue;
    const keys = new Set<string>();
    for (const areaId of idea.h1h3Ids)
      for (const key of keysByArea.get(areaId) ?? []) keys.add(key);
    for (const key of keys) {
      if (!idsByKey.has(key)) idsByKey.set(key, new Set());
      idsByKey.get(key)!.add(idea.id);
    }
  }

  const countByKey = new Map<string, number>();
  for (const [key, set] of idsByKey) countByKey.set(key, set.size);

  const groups: ProblemSpaceGroup[] = order.map((key) => ({
    id: key,
    ...metaFor(key),
    areas: areasByKey.get(key) ?? []
  }));

  return { groups, countByKey };
}
