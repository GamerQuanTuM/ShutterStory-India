"use client";

import Link from "next/link";
import { useMedia } from "../context/MediaContext";

export default function DashboardPage() {
  const { images, videos } = useMedia();

  const stats = [
    { label: "Images Uploaded", value: images.length, max: 16, href: "/dashboard/images" },
    { label: "Videos Uploaded", value: videos.length, max: 16, href: "/dashboard/videos" },
    { label: "Storage Used", value: `${Math.round([...images, ...videos].reduce((a, i) => a + i.size, 0) / 1024 / 1024)}`, max: null, unit: "MB", href: null },
  ];

  return (
    <>
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Studio Overview</h1>
          <p className="dash-subtitle">Manage your portfolio media</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/dashboard/images" className="btn-primary">
            <span>Upload Images</span>
          </Link>
          <Link href="/dashboard/videos" className="btn-ghost">
            Upload Videos
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 48,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="stat-card"
            style={{ cursor: s.href ? "none" : "default" }}
            onClick={() => s.href && (window.location.href = s.href)}
          >
            <div className="stat-value">
              {s.value}
              {s.unit && (
                <span style={{ fontSize: "1.2rem", color: "var(--muted)" }}>
                  {" "}{s.unit}
                </span>
              )}
            </div>
            <div className="stat-label">{s.label}</div>
            {s.max && (
              <div
                style={{
                  marginTop: 12,
                  height: 2,
                  background: "var(--border-2)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${(Number(s.value) / s.max) * 100}%`,
                    background: Number(s.value) >= s.max ? "#E07070" : "var(--gold)",
                    transition: "width 0.8s var(--ease-out)",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Images Preview */}
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 400,
            }}
          >
            Recent Images
          </h3>
          <Link
            href="/dashboard/images"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--gold)",
            }}
          >
            Manage All →
          </Link>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 8,
          }}
        >
          {images.slice(0, 6).map((img) => (
            <div key={img.id} className="dash-media-cell">
              <img src={img.url} alt={img.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
          {images.length === 0 && (
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", gridColumn: "1/-1" }}>
              No images uploaded yet.{" "}
              <Link href="/dashboard/images" style={{ color: "var(--gold)" }}>
                Upload now →
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Recent Videos Preview */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 400,
            }}
          >
            Recent Videos
          </h3>
          <Link
            href="/dashboard/videos"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--gold)",
            }}
          >
            Manage All →
          </Link>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 8,
          }}
        >
          {videos.slice(0, 6).map((vid) => (
            <div 
              key={vid.id} 
              className="dash-media-cell"
              onMouseEnter={(e) => {
                const v = e.currentTarget.querySelector("video");
                if (v) v.play().catch(() => {});
              }}
              onMouseLeave={(e) => {
                const v = e.currentTarget.querySelector("video");
                if (v) { v.pause(); v.currentTime = 0; }
              }}
            >
              <video src={vid.url} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div className="dash-media-cell-actions">
                <div style={{ color: "var(--white)", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
                  ▷
                </div>
              </div>
            </div>
          ))}
          {videos.length === 0 && (
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", gridColumn: "1/-1" }}>
              No videos uploaded yet.{" "}
              <Link href="/dashboard/videos" style={{ color: "var(--gold)" }}>
                Upload now →
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
