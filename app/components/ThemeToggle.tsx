"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <button className="theme-toggle" aria-label="Toggle Theme" style={{ width: 18, height: 18, background: "transparent", border: "none" }} />;
  }

  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle Theme"
      title="Toggle Theme"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--white)",
        cursor: "none",
        transition: "color 0.3s",
      }}
    >
      {theme === "dark" ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}
