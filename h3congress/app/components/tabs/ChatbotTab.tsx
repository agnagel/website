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

export default function ChatbotTab() {
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
    <section className="h3-chatbot" aria-label="H3 Congress chatbot">
      <div className="h3-chatbot-intro">
        <p className="h3-eyebrow h3-eyebrow-gold">Ask Modbot</p>
        <h2>Chat with the Congressional Modernization Assistant</h2>
        <p>Have a question about the Three Horizons framework, a reform idea, or any of the citations? Ask it here!</p>
      </div>
      <div className="h3-chatbot-embed" ref={hostRef} />
    </section>
  );
}
