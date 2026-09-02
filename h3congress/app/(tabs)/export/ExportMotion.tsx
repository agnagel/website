"use client";

import { useEffect } from "react";

// Force an instant jump to the very top on mount. Next's App Router skips its
// scroll reset when it decides the new page's top is already in view (which
// depends on where you were scrolled before), and html { scroll-behavior:
// smooth } can otherwise leave the landing a little below the top.
export default function ExportMotion() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return null;
}
