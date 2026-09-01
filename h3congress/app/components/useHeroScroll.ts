"use client";

import { useEffect } from "react";

type MotionPath = SVGPathElement & { _len?: number };

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

// Drives the About page's scroll-linked motion: the progress bar, the parallax
// hero + rising sun, the "capacity gap" line-drawing, and the horizons reveal
// panels. It operates purely on well-known element ids/classes rendered by
// AboutTab, so it takes no arguments and owns its own scroll/resize listeners.
export function useHeroScroll() {
  useEffect(() => {
    let ticking = false;
    let beaconTimer: number | null = null;

    const sectionProgress = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return 0;
      return clamp(-rect.top / total);
    };

    const update = () => {
      const viewportHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - viewportHeight;

      const progressBar = document.getElementById("h3-progress");
      if (progressBar) {
        progressBar.style.width =
          (docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0) + "%";
      }

      const hero = document.getElementById("h3-hero-inner");
      if (hero) {
        const y = window.scrollY || 0;
        hero.style.transform = `translateY(${y * 0.22}px)`;
        hero.style.opacity = String(clamp(1 - y / (viewportHeight * 0.85)));
        const heroSun = document.getElementById("h3-hero-sun");
        if (heroSun) {
          const sunP = clamp(y / viewportHeight);
          heroSun.setAttribute("transform", `translate(0, ${70 - sunP * 240})`);
        }
      }

      const gap = document.getElementById("gap");
      if (gap) {
        const p = sectionProgress(gap);
        const draw = Math.min(1, p * 1.5);

        ["h3-tech-path", "h3-cap-path"].forEach((id) => {
          const path = document.getElementById(id) as MotionPath | null;
          if (!path) return;
          if (!path._len) path._len = path.getTotalLength();
          path.style.strokeDasharray = String(path._len);
          path.style.strokeDashoffset = String(path._len * (1 - draw));
        });

        const fill = document.getElementById("h3-gap-fill");
        if (fill) fill.style.opacity = String(Math.max(0, p - 0.55) * 0.8);

        const label = document.getElementById("h3-gap-label");
        if (label) label.style.opacity = String(Math.max(0, p - 0.6) * 2.6);

        const caption = document.getElementById("h3-gap-caption");
        if (caption) caption.style.opacity = String(Math.max(0, p - 0.66) * 3);
      }

      const horizons = document.getElementById("horizons");
      if (horizons) {
        const p = sectionProgress(horizons);
        const step = Math.max(0, Math.min(3, Math.floor(p * 3.999)));

        const barPct = [0, 33.333, 66.667, 100][step];
        const pencil = document.getElementById("h3-reveal-pencil");
        const bar = document.getElementById("h3-reveal-bar");
        const flag = document.getElementById("h3-reveal-flag");
        if (pencil) pencil.style.clipPath = `inset(0 0 ${barPct}% 0)`;
        if (bar) bar.style.bottom = `${barPct}%`;
        if (flag) {
          flag.textContent = [
            "H1 · The system today",
            "H2− · Pressure relief",
            "H2+ · Capacity shift",
            "H3 · The future Congress"
          ][step];
        }

        const hint = horizons.querySelector<HTMLElement>(".h3-scroll-hint");
        if (hint) {
          const mix = (a: number, b: number) => Math.round(a + (b - a) * p);
          hint.style.color = `rgb(${mix(110, 29)}, ${mix(118, 226)}, ${mix(134, 255)})`;
          hint.style.textShadow =
            p > 0.05
              ? `0 0 ${Math.round(10 * p)}px rgba(29, 226, 255, ${(0.8 * p).toFixed(2)})`
              : "none";
        }

        const beacon = horizons.querySelector(".h3-beacon");
        if (beacon) {
          if (step >= 3) {
            if (!beacon.classList.contains("is-live") && beaconTimer === null) {
              beaconTimer = window.setTimeout(() => {
                beacon.classList.add("is-live");
                beaconTimer = null;
              }, 760);
            }
          } else {
            if (beaconTimer !== null) {
              window.clearTimeout(beaconTimer);
              beaconTimer = null;
            }
            beacon.classList.remove("is-live");
          }
        }

        document.querySelectorAll<HTMLElement>(".h3-panel").forEach((el) => {
          const on = Number(el.dataset.step) === step;
          el.style.opacity = on ? "1" : "0";
          el.style.transform = on ? "translateY(0)" : "translateY(16px)";
          el.style.pointerEvents = on ? "auto" : "none";
        });
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      if (beaconTimer !== null) window.clearTimeout(beaconTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
}
