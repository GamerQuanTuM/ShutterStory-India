"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#videos", label: "Films" },
  { href: "#services", label: "Services" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Entrance animation
    gsap.fromTo(
      nav,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 2.2 }
    );

    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar${scrolled ? " scrolled" : " force-dark"}`}
      >
        <Link href="/" className="navbar-logo">
          Shutter<em>Story</em> India
        </Link>

        <ul className="navbar-links">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => handleNav(l.href)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-actions" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <ThemeToggle />

        </div>

        <button
          className="hamburger"
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            style={{
              transform: menuOpen ? "rotate(45deg) translateY(6px)" : undefined,
            }}
          />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span
            style={{
              transform: menuOpen
                ? "rotate(-45deg) translateY(-6px)"
                : undefined,
            }}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => handleNav(l.href)}
          >
            {l.label}
          </a>
        ))}

      </div>
    </>
  );
}
