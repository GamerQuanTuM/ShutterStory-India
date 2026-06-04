"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import BentoGallery from "./components/BentoGallery";
import VideoGrid from "./components/VideoGrid";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import { useMedia } from "./context/MediaContext";
import { Mail } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    number: "01",
    title: "Wedding Photography",
    desc: "Timeless imagery that captures the emotions, details, and stories of your most sacred day.",
    bg: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
  },
  {
    number: "02",
    title: "Cinematic Films",
    desc: "Feature-quality wedding films and commercial videos that tell your story with cinematic depth.",
    bg: "https://plus.unsplash.com/premium_photo-1682097066897-209d0d9e9ae5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    number: "03",
    title: "Portrait Sessions",
    desc: "Intimate portrait photography that reveals character, beauty, and authentic human connection.",
    bg: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80",
  },
  {
    number: "04",
    title: "Editorial & Commercial",
    desc: "High-end editorial and brand photography for fashion, luxury, and lifestyle campaigns.",
    bg: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80",
  },
];

const ABOUT_PHOTO =
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&q=80";

export default function Home() {
  const { images, videos } = useMedia();

  // Contact form state
  const [formData, setFormData] = useState({ name: "", email: "", projectType: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    setFormError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setFormStatus("success");
      setFormData({ name: "", email: "", projectType: "", message: "" });
      setTimeout(() => setFormStatus("idle"), 5000);
    } catch (err: unknown) {
      setFormStatus("error");
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  // Section refs for scroll animations
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const portfolioRef = useRef<HTMLElement>(null);
  const videosRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Generic reveal for all .reveal elements
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          }
        );
      });

      // About image parallax
      const aboutImg = aboutRef.current?.querySelector(".about-image-wrap img");
      if (aboutImg) {
        gsap.to(aboutImg, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // Service cards stagger
      const svcCards = servicesRef.current?.querySelectorAll(".service-card");
      if (svcCards && svcCards.length > 0) {
        gsap.from(svcCards, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: servicesRef.current,
            start: "top 80%",
            once: true,
          },
        });
      }

      // Stats counter animation
      const stats = document.querySelectorAll(".about-stat-num");
      stats.forEach((el) => {
        const target = parseInt(el.textContent ?? "0");
        gsap.from(el, {
          textContent: 0,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate() {
            el.textContent = Math.round(
              parseFloat(el.textContent ?? "0")
            ).toString() + "+";
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Loader />
      <Navbar />

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── ABOUT ── */}
      <section
        className="section"
        id="about"
        ref={aboutRef}
        style={{ background: "var(--bg-2)" }}
      >
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrap reveal">
              <Image
                src={ABOUT_PHOTO}
                alt="ShutterStory India — Photographer"
                width={600}
                height={800}
                style={{ width: "100%", height: "auto" }}
                unoptimized
              />
              <div className="about-image-accent" />
            </div>

            <div className="about-text">
              <div className="reveal">
                <span className="label">About the Studio</span>
              </div>
              <h2 className="reveal" style={{ marginTop: 16 }}>
                Light, Emotion,{" "}
                <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Truth</em>
              </h2>
              <p className="reveal">
                ShutterStory India is a premium photography and cinematography
                studio founded on a single belief: every human story deserves to
                be told beautifully. We work across weddings, portraits,
                editorial assignments, and commercial campaigns — bringing
                cinematic vision to every project.
              </p>
              <p className="reveal">
                Based across India with studios in Mumbai, Delhi, and Bangalore,
                we travel wherever the story takes us. Our approach is
                documentary at heart — we capture what is real, what is felt,
                and what is true, elevated by masterful technique.
              </p>

              <div className="about-stats reveal">
                {[
                  { num: "8", label: "Years of Excellence" },
                  { num: "600", label: "Stories Told" },
                  { num: "15", label: "Awards Won" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="about-stat-num">{s.num}+</div>
                    <div className="about-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="reveal" style={{ marginTop: 8 }}>
                <a href="#contact" className="btn-primary">
                  <span>Work With Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section" id="services" ref={servicesRef}>
        <div className="container">
          <div className="section-header">
            <span className="label reveal">What We Do</span>
            <h2 className="reveal" style={{ marginTop: 16 }}>
              Our{" "}
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Services</em>
            </h2>
          </div>

          <div className="services-accordion reveal">
            {SERVICES.map((s) => (
              <div className="service-accordion-item force-dark" key={s.number}>
                <Image
                  src={s.bg}
                  alt={s.title}
                  fill
                  className="service-bg"
                  unoptimized
                />
                <div className="service-overlay" />
                <div className="service-content">
                  <div className="service-header">
                    <span className="service-num">{s.number}</span>
                    <h3 className="service-title">{s.title}</h3>
                  </div>
                  <div className="service-details">
                    <p>{s.desc}</p>
                    <a href="#contact" className="btn-ghost" style={{ marginTop: 16 }}>
                      Enquire
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO (IMAGES) ── */}
      <section
        className="section"
        id="portfolio"
        ref={portfolioRef}
        style={{ background: "var(--bg-2)", paddingBottom: "var(--section-pad)" }}
      >
        <div className="container">
          <div className="section-header">
            <div className="section-header-inner">
              <div>
                <span className="label reveal">Photography</span>
                <h2 className="reveal" style={{ marginTop: 16 }}>
                  The{" "}
                  <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Gallery</em>
                </h2>
              </div>
            </div>
          </div>
          <BentoGallery items={images} />
        </div>
      </section>

      {/* ── PORTFOLIO (VIDEOS) ── */}
      <section className="section" id="videos" ref={videosRef}>
        <div className="container">
          <div className="section-header">
            <div className="section-header-inner">
              <div>
                <span className="label reveal">Cinematography</span>
                <h2 className="reveal" style={{ marginTop: 16 }}>
                  The{" "}
                  <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Films</em>
                </h2>
              </div>
            </div>
          </div>
          <VideoGrid items={videos} />
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <Testimonials />

      {/* ── CONTACT ── */}
      <section
        className="section"
        id="contact"
        ref={contactRef}
        style={{
          background: "var(--bg-2)",
          borderTop: "1px solid var(--border-2)",
        }}
      >
        <div className="container">
          <div className="section-header">
            <span className="label reveal">Get In Touch</span>
            <h2 className="reveal" style={{ marginTop: 16 }}>
              Let&apos;s Create{" "}
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Together</em>
            </h2>
          </div>

          <div className="contact-grid">
            <form
              className="contact-form"
              onSubmit={handleContactSubmit}
            >
              <div className="form-group reveal">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Arjun Mehta"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group reveal">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="hello@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group reveal">
                <label className="form-label">Project Type</label>
                <select
                  className="form-input"
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                >
                  <option value="">Select service…</option>
                  <option>Careers</option>
                  <option>Wedding Photography</option>
                  <option>Cinematic Film</option>
                  <option>Portrait Session</option>
                  <option>Editorial / Commercial</option>
                </select>
              </div>
              <div className="form-group reveal">
                <label className="form-label">Message</label>
                <textarea
                  className="form-input"
                  rows={5}
                  placeholder="Tell us about your vision…"
                  style={{ resize: "vertical" }}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              {formStatus === "success" && (
                <div style={{ padding: "12px 16px", background: "rgba(80,200,120,0.12)", border: "1px solid rgba(80,200,120,0.3)", borderRadius: 8, color: "#4dd68c", fontSize: "0.85rem" }}>
                  ✓ Your message has been sent! We&apos;ll get back to you shortly.
                </div>
              )}
              {formStatus === "error" && (
                <div style={{ padding: "12px 16px", background: "rgba(224,112,112,0.12)", border: "1px solid rgba(224,112,112,0.3)", borderRadius: 8, color: "#E07070", fontSize: "0.85rem" }}>
                  ✗ {formError}
                </div>
              )}
              <div className="reveal">
                <button type="submit" className="btn-primary" disabled={formStatus === "sending"}>
                  <span>{formStatus === "sending" ? "Sending…" : "Send Message"}</span>
                </button>
              </div>
            </form>

            <div className="contact-info">
              {[
                { label: "Studio — Mumbai", value: "+91 98765 43210" },
                { label: "Email", value: "hello@shutterstory.in" },
                { label: "Locations", value: "Mumbai · Delhi · Bangalore · Pan-India" },
                { label: "Availability", value: "Monday – Saturday, 10am – 7pm IST" },
              ].map((item) => (
                <div className="contact-info-item reveal" key={item.label}>
                  <span className="contact-info-label">{item.label}</span>
                  <span className="contact-info-value">{item.value}</span>
                </div>
              ))}

              <div className="reveal" style={{ paddingTop: 16, borderTop: "1px solid var(--border-2)" }}>
                <span className="label" style={{ display: "block", marginBottom: 16 }}>
                  Follow Our Work
                </span>
                <div className="social-links" style={{ display: "flex", gap: "12px" }}>
                  <a href="#" className="social-link" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href="#" className="social-link" aria-label="WhatsApp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-link" aria-label="YouTube">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                  </a>
                  <a href="#" className="social-link" aria-label="Email">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
