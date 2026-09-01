// Structural scaffold for the System Diagram tab: the three top-level nodes of
// the legislative cycle and the blocks ("buckets") inside them.
//
// This is NOT sheet-derived — the Google Sheet has no column for the diagram's
// chrome. Buckets map 1:1 to the sheet's "Block" column via BLOCK_TO_BUCKET in
// scripts/sync-system.mjs; every other bucket here is display-only (clickable,
// but no problem areas mapped to it yet) so the whole system stays explorable.
//
// The System Diagram groups the shared PROBLEM_AREAS / H2_IDEAS (app/data/
// problemSpace.ts) by their `bucket`, exactly as the Domains tab groups them by
// `domains`. Both tabs then render the same cards.

type SystemNode = {
  id: string;
  eyebrow: string;
  title: string;
  blurb: string;
  buckets: string[];
};

type Bucket = {
  label: string;
  node: string;
  blurb: string;
};

const NODES: SystemNode[] = [
  {
    id: "input",
    eyebrow: "Inputs",
    title: "Democratic Input",
    blurb: "What the public brings to the legislature.",
    buckets: ["community"]
  },
  {
    id: "institution",
    eyebrow: "Institution",
    title: "The Institution",
    blurb:
      "The bicameral institution — its culture, its technology, its people, and its capacity to oversee.",
    buckets: ["culture", "technology", "oversight", "personnel"]
  },
  {
    id: "output",
    eyebrow: "Outputs",
    title: "Institutional Outputs",
    blurb: "What Congress produces and enters into law.",
    buckets: ["law"]
  }
];

export const BUCKETS: Record<string, Bucket> = {
  community: {
    label: "Constituent Engagement",
    node: "input",
    blurb: "How the public reaches Congress and how that input is understood."
  },
  culture: {
    label: "Culture",
    node: "institution",
    blurb: "The institution’s norms, incentives, and appetite for change."
  },
  technology: {
    label: "Technology",
    node: "institution",
    blurb: "The tools, procurement, and digital infrastructure Congress runs on."
  },
  oversight: {
    label: "Oversight",
    node: "institution",
    blurb: "Congress’s capacity to scrutinize the executive branch."
  },
  personnel: {
    label: "Personnel",
    node: "institution",
    blurb:
      "The permanent, in-house technical and professional talent Congress can hire and retain."
  },
  law: {
    label: "Legislation",
    node: "output",
    blurb: "How bills are drafted and become the United States Code."
  },

  // Display-only buckets: clickable but with no sheet rows mapped to them yet.
  elections: {
    label: "Elections",
    node: "input",
    blurb: "How districts and at-large seats are filled and representatives are chosen."
  },
  stakeholder: {
    label: "Stakeholder Engagement",
    node: "input",
    blurb: "Testimony, advocacy, and organized interests reaching Congress."
  },
  appropriationsRequests: {
    label: "Funding Requests",
    node: "input",
    blurb: "Community-project and funding requests constituents bring to Congress."
  },
  casework: {
    label: "Casework",
    node: "input",
    blurb: "Individual constituent service — helping people navigate the federal government."
  },
  otherServices: {
    label: "Other Services",
    node: "input",
    blurb: "Academy nominations, tours, flag requests, and other constituent services."
  },
  members: {
    label: "Members",
    node: "institution",
    blurb: "The members of Congress and the bipartisanship between them."
  },
  structure: {
    label: "Structure",
    node: "institution",
    blurb: "The organization and leadership of the institution."
  },
  processes: {
    label: "Processes",
    node: "institution",
    blurb: "The rules and norms that govern how Congress operates."
  },
  house: {
    label: "House of Representatives",
    node: "institution",
    blurb: "The House of Representatives — closer to the people."
  },
  senate: {
    label: "Senate",
    node: "institution",
    blurb: "The Senate — the more deliberative chamber."
  },
  supportAgencies: {
    label: "Support Agencies",
    node: "institution",
    blurb: "CBO, CRS, and GAO — the nonpartisan legislative support agencies."
  },
  districtOffices: {
    label: "District Offices",
    node: "institution",
    blurb: "District and state offices delivering local service."
  },
  dcOffices: {
    label: "DC Offices",
    node: "institution",
    blurb: "The Washington offices where members and their staff do the work of legislating."
  },
  committees: {
    label: "Committees",
    node: "institution",
    blurb: "The committees and subcommittees where legislation and oversight are worked out."
  },
  appropriations: {
    label: "Appropriations",
    node: "output",
    blurb: "How Congress funds the government through appropriations."
  },
  confirmations: {
    label: "Confirmations",
    node: "output",
    blurb: "The Senate’s advice-and-consent over nominees."
  },
  constituentOutcomes: {
    label: "Constituent Outcomes",
    node: "output",
    blurb: "The services and results delivered back to constituents."
  },
  otherActivities: {
    label: "Other Activities",
    node: "output",
    blurb:
      "Honors, electoral duties, impeachments, treaties, and Congress’s other constitutional business."
  },
  communications: {
    label: "Communications",
    node: "output",
    blurb: "How Congress communicates its work to the public and the press."
  }
};

// The label shown for a bucket id (safe fallback to the id itself).
export function bucketLabel(id: string): string {
  return BUCKETS[id]?.label ?? id;
}

// The node title a bucket belongs to (e.g. "The Institution").
export function bucketNodeTitle(id: string): string {
  const nodeId = BUCKETS[id]?.node;
  return NODES.find((n) => n.id === nodeId)?.title ?? "";
}
