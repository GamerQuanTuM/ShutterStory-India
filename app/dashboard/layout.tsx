"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: "⬡" },
  { href: "/dashboard/images", label: "Images", icon: "◈" },
  { href: "/dashboard/videos", label: "Videos", icon: "▷" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn, router]);

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
