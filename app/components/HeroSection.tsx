"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

// Cinematic placeholder gradient image (no external deps needed)
const BG_SRC = "https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&q=80";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.4 });

      // Label
      tl.from(labelRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Title lines
      tl.from(
        [line1Ref.current, line2Ref.current],
        {
          y: "100%",
          duration: 1.1,
          stagger: 0.12,
          ease: "power4.out",
        },
        "-=0.4"
      );

      // Subtitle
      tl.from(
        subtitleRef.current,
        { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      );

      // Actions
      tl.from(
        actionsRef.current,
        { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      );

      // Parallax bg on scroll
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero force-dark" ref={heroRef}>
      {/* Background */}
      <div className="hero-bg" ref={bgRef}>
        <Image
          src={BG_SRC}
          alt="ShutterStory India — Premium Photography"
          fill
          style={{ objectFit: "cover" }}
          priority
          unoptimized
        />
        <div className="overlay" />
        {/* Extra cinematic vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      </div>

      <div className="hero-content">
        <div className="hero-label" ref={labelRef}>
          <span className="divider" />
          <span className="label">Est. 2018 · India</span>
        </div>

        <div className="hero-title">
          <span className="hero-title-line" ref={line1Ref}>
            <h1 style={{ display: "inline" }}>
              Every Frame,
            </h1>
          </span>
          <span
            className="hero-title-line"
            ref={line2Ref}
            style={{ display: "block" }}
          >
            <h1
              style={{
                display: "inline",
                color: "var(--gold)",
                fontStyle: "italic",
              }}
            >
              A Story.
            </h1>
          </span>
        </div>

        <p className="hero-subtitle" ref={subtitleRef}>
          Premium photography &amp; cinematography across India. We capture
          the ephemeral, the intimate, and the extraordinary — frame by frame.
        </p>

        <div className="hero-actions" ref={actionsRef}>
          <a href="#portfolio" className="btn-primary">
            <span>View Portfolio</span>
          </a>
          <a href="#contact" className="btn-ghost">
            Book a Session
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
