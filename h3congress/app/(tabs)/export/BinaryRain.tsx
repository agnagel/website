"use client";

import { useEffect, useRef } from "react";

// Muted grays and browns, to sit quietly on the beige paper.
const COLORS = ["#6e7686", "#847c6b", "#7a6a4f", "#9c8f74", "#635231", "#8a8172"];
// Warm paper (#eadfc4) at low alpha — each frame paints this over the canvas so
// old digits dissolve back into the background, leaving fading drip trails.
const FADE = "rgba(234, 223, 196, 0.14)";
const FONT_SIZE = 16;

// A canvas "matrix"-style rain of 0s and 1s dripping down the right side.
export default function BinaryRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "top";
      columns = Math.max(1, Math.floor(width / FONT_SIZE));
      // Stagger each column's starting height so they don't drip in lockstep.
      drops = Array.from({ length: columns }, () =>
        Math.floor((Math.random() * -height) / FONT_SIZE)
      );
      ctx.clearRect(0, 0, width, height);
    };

    const draw = () => {
      ctx.fillStyle = FADE;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 0.55;
      for (let i = 0; i < columns; i++) {
        const char = Math.random() < 0.5 ? "0" : "1";
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fillText(char, x, y);
        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 90) return; // ~11fps: a gentle drip, not a torrent
      last = t;
      draw();
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduce) {
      draw();
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="h3-export-rain" aria-hidden="true" />;
}
