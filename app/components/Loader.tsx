"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const loader = loaderRef.current;
    const text = textRef.current;
    const bar = barRef.current;
    if (!loader || !text || !bar) return;

    document.body.style.overflow = "hidden";

    // Animate text in
    gsap.to(text, { opacity: 1, duration: 0.6, ease: "power2.out" });

    // Fake progress
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 18 + 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setPct(100);
        // Exit animation
        setTimeout(() => {
          gsap.to(text, { opacity: 0, y: -20, duration: 0.5 });
          gsap.to(loader, {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut",
            onComplete: () => {
              loader.style.display = "none";
              document.body.style.overflow = "";
            },
          });
        }, 300);
      } else {
        setPct(Math.floor(current));
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="page-loader" ref={loaderRef}>
      <div className="loader-text" ref={textRef}>
        <span style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }}>
          Shutter
        </span>
        Story India
      </div>
      <div className="loader-bar-wrap">
        <div
          className="loader-bar"
          ref={barRef}
          style={{ width: `${pct}%`, transition: "width 0.08s linear" }}
        />
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          color: "var(--muted)",
          marginTop: "8px",
        }}
      >
        {pct}%
      </div>
    </div>
  );
}
