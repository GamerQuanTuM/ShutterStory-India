"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_EMAIL = "admin@shutterstory.in";
const ADMIN_PASSWORD = "ShutterStory@2024";
const AUTH_KEY = "ssi_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(AUTH_KEY);
    if (stored === "1") setIsLoggedIn(true);
  }, []);

  const login = (email: string, password: string): boolean => {
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      setIsLoggedIn(true);
      sessionStorage.setItem(AUTH_KEY, "1");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
