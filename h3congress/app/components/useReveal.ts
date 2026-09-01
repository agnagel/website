"use client";

import { useEffect } from "react";

/**
 * Fades in any element marked with `data-reveal` as it enters the viewport.
 * Shared across the tabbed pages so each page animates independently.
 */
export function useReveal() {
  useEffect(() => {
    const reveals = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    reveals.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(22px)";
    });

    let observer: IntersectionObserver | null = null;

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const target = entry.target as HTMLElement;
            target.style.opacity = "1";
            target.style.transform = "none";
            observer?.unobserve(target);
          });
        },
        { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
      );
      reveals.forEach((el) => observer?.observe(el));
    } else {
      reveals.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }

    const safety = window.setTimeout(() => {
      reveals.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
    }, 400);

    return () => {
      window.clearTimeout(safety);
      observer?.disconnect();
    };
  }, []);
}
