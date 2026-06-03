"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

const BG =
  "https://images.unsplash.com/photo-1609429019995-8c40f49535a5?w=1400&q=80";

export default function LoginPage() {
  const { isLoggedIn, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoggedIn) router.push("/dashboard");
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (!formRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current!.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }, formRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(email, password);
    if (!ok) {
      setError("Invalid credentials. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      {/* Visual Side */}
      <div className="login-visual">
        <Image
          src={BG}
          alt="ShutterStory India"
          fill
          style={{ objectFit: "cover" }}
          priority
          unoptimized
        />
        <div className="login-visual-overlay" />
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 48,
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              color: "var(--white)",
              lineHeight: 1.15,
            }}
          >
            The Art of
            <br />
            <em style={{ color: "var(--gold)" }}>Visual Storytelling</em>
          </div>
          <p
            style={{
              marginTop: 16,
              fontSize: "0.85rem",
              color: "rgba(232,227,220,0.7)",
            }}
          >
            Studio Dashboard — Authorized Access Only
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="login-form-side">
        <div className="login-form-inner" ref={formRef}>
          <div>
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--muted)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 40,
              }}
            >
              ← Back to site
            </Link>
            <span className="label">Studio Portal</span>
            <h2
              className="login-title"
              style={{ marginTop: 12, marginBottom: 4 }}
            >
              Welcome Back
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              Sign in to manage your portfolio
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="login-error">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="admin@shutterstory.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%", marginTop: 8, justifyContent: "center" }}
            >
              <span>{loading ? "Signing in…" : "Sign In"}</span>
            </button>
          </form>

          <div
            style={{
              fontSize: "0.72rem",
              color: "var(--muted)",
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            <span style={{ color: "var(--gold)" }}>Hint:</span>{" "}
            admin@shutterstory.in &nbsp;/&nbsp; ShutterStory@2024
          </div>
        </div>
      </div>
    </div>
  );
}
