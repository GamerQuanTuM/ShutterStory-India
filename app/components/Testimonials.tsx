"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    quote:
      "ShutterStory India captured our wedding in ways we couldn't have imagined. Every photograph feels like a painting. We are beyond words.",
    name: "Priya & Arjun Mehta",
    role: "Wedding Photography — Udaipur",
    initial: "P",
    stars: 5,
  },
  {
    quote:
      "The editorial shoot for our brand exceeded every expectation. The team's eye for light and composition is truly extraordinary.",
    name: "Neha Krishnan",
    role: "Commercial Editorial — Mumbai",
    initial: "N",
    stars: 5,
  },
  {
    quote:
      "Our engagement shoot was magical. Saurav has a rare talent for making you feel completely at ease while creating stunning visuals.",
    name: "Aarav & Zara Shah",
    role: "Engagement Shoot — Goa",
    initial: "A",
    stars: 5,
  },
  {
    quote:
      "I've worked with many photographers across India. ShutterStory India stands in a class entirely of their own. Breathtaking work.",
    name: "Ritu Kapoor",
    role: "Portrait Session — Delhi",
    initial: "R",
    stars: 5,
  },
  {
    quote:
      "The cinematic quality of our wedding film left us in tears. Every moment was preserved beautifully. Cannot recommend highly enough.",
    name: "Deepika & Rohan Agarwal",
    role: "Cinematic Wedding Film — Jaipur",
    initial: "D",
    stars: 5,
  },
  {
    quote:
      "From pre-wedding shoots to the big day, every frame tells our story perfectly. Simply the best in India.",
    name: "Kavya & Siddharth",
    role: "Full-Day Wedding Package — Bangalore",
    initial: "K",
    stars: 5,
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Just fade in the whole track, no staggering individual cards since it's infinite scroll
      gsap.from(trackRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section" id="testimonials" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="label">Testimonials</span>
          <h2 style={{ marginTop: 16, maxWidth: 600 }}>
            Words from our <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Clients</em>
          </h2>
        </div>

        <div className="testimonials-marquee-wrap" ref={trackRef}>
          <div className="marquee-group">
            {TESTIMONIALS.map((t, i) => (
              <div key={`a-${i}`} className="testimonial-card">
                <div className="stars">{"★".repeat(t.stars)}</div>
                <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initial}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Duplicate group for seamless infinite scrolling */}
          <div className="marquee-group" aria-hidden="true">
            {TESTIMONIALS.map((t, i) => (
              <div key={`b-${i}`} className="testimonial-card">
                <div className="stars">{"★".repeat(t.stars)}</div>
                <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initial}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
