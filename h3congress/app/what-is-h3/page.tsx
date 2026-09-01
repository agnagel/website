import type { Metadata } from "next";
import WhatIsH3 from "./WhatIsH3";

export const metadata: Metadata = {
  title: "What is Horizon 3? | H3 Congress",
  description:
    "An explainer and interactive test for identifying Horizon 3 ideas in the H3 Congress project."
};

export default function WhatIsH3Page() {
  return <WhatIsH3 />;
}
