"use client";

import { useEffect, useRef } from "react";

// The arxivix embed mounts its chat panel immediately after its own <script>
// tag (document.currentScript + insertAdjacentElement("afterend", …)). So we
// append the script INTO this page's embed container — that way the widget
// renders inline in the main section rather than at the bottom of <body>, and
// clearing the container on unmount removes both the script and the widget so
// it never bleeds onto other pages.
const EMBED_SRC = "https://arxivix.com/embed.js";
const EMBED_KEY = "emb_rN8oYY9nk7p35q5NbusMqhqGLYodKV89";

export default function ModbotTab() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const script = document.createElement("script");
    script.src = EMBED_SRC;
    script.async = true;
    script.setAttribute("data-arxivix-key", EMBED_KEY);
    host.appendChild(script);
    return () => {
      host.replaceChildren();
    };
  }, []);

  return (
    <section className="h3-modbot" aria-label="Modbot congressional modernization assistant">
      <div className="h3-modbot-bot" aria-hidden="true">
        <div className="h3-modbot-bot-inner">
          <svg viewBox="0 0 120 120" fill="none">
            <line
              className="bot-antenna-stem"
              x1="60"
              y1="27"
              x2="60"
              y2="15"
              stroke="var(--neon-cyan)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle className="bot-antenna" cx="60" cy="11" r="4.5" fill="var(--neon-green)" />
            <rect x="19" y="45" width="6" height="20" rx="3" fill="var(--neon-cyan)" />
            <rect x="95" y="45" width="6" height="20" rx="3" fill="var(--neon-cyan)" />
            <rect
              x="26"
              y="27"
              width="68"
              height="58"
              rx="17"
              fill="#0c1a34"
              stroke="var(--neon-cyan)"
              strokeWidth="3"
            />
            <circle className="bot-eye" cx="47" cy="53" r="6" fill="var(--neon-green)" />
            <circle className="bot-eye" cx="73" cy="53" r="6" fill="var(--neon-green)" />
            <path
              d="M46 68 q14 11 28 0"
              stroke="var(--neon-cyan)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      <div className="h3-modbot-intro">
        <p className="h3-eyebrow h3-eyebrow-gold">Ask Modbot</p>
        <h2>Chat with the Congressional Modernization Assistant</h2>
        <p>Have a question about the Three Horizons framework, a reform idea, or any of the citations? Ask it here!</p>
      </div>
      <div className="h3-modbot-embed" ref={hostRef} />
    </section>
  );
}
