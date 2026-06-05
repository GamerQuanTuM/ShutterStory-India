"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useMedia } from "../context/MediaContext";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: "⬡" },
  { href: "/dashboard/images", label: "Images", icon: "◈" },
  { href: "/dashboard/videos", label: "Videos", icon: "▷" },
  { href: "/dashboard/contacts", label: "Contacts", icon: "✉" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isInitialized, logout } = useAuth();
  const { loading: mediaLoading } = useMedia();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isInitialized && !isLoggedIn) router.push("/login");
  }, [isLoggedIn, isInitialized, router]);

  if (!isInitialized || mediaLoading) {
    return (
      <div className="dash-layout">
        <aside className="dash-sidebar" style={{ pointerEvents: "none" }}>
          <div className="dash-sidebar-logo">
            <div className="skeleton" style={{ width: "140px", height: "24px", marginBottom: "4px" }} />
            <div className="skeleton" style={{ width: "80px", height: "10px" }} />
          </div>
          <nav style={{ flex: 1, padding: "0 28px" }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: "40px", marginBottom: "8px", width: "100%" }} />
            ))}
          </nav>
        </aside>
        <main className="dash-main">
          <div className="skeleton" style={{ width: "300px", height: "40px", marginBottom: "16px" }} />
          <div className="skeleton" style={{ width: "400px", height: "20px", marginBottom: "40px" }} />
          <div className="dash-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: "4/3", width: "100%" }} />
            ))}
          </div>
        </main>
      </div>
    );
  }
  if (!isLoggedIn) return null;

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-logo">
          <Link href="/" style={{ display: "block" }}>
            <span>
              Shutter<span style={{ color: "var(--gold)" }}>Story</span> India
            </span>
            <div
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                color: "var(--muted)",
                marginTop: 4,
                textTransform: "uppercase",
              }}
            >
              Studio Dashboard
            </div>
          </Link>
        </div>

        <nav style={{ flex: 1 }}>
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`dash-nav-item${pathname === n.href ? " active" : ""}`}
            >
              <span style={{ fontSize: "1rem", width: 20 }}>{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: "24px 28px", borderTop: "1px solid var(--border-2)" }}>
          <button
            onClick={() => { logout(); router.push("/"); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "var(--muted)",
              fontSize: "0.78rem",
              letterSpacing: "0.05em",
              transition: "color 0.3s",
              background: "none",
              border: "none",
              width: "100%",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--white)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            <span>↩</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">{children}</main>
    </div>
  );
}
