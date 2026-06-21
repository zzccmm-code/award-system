import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

const TOKEN_KEY = "award_system_token";
const USER_KEY = "award_system_user";

interface UserInfo {
  username: string;
  display_name: string;
}

interface AuthContextType {
  token: string | null;
  user: UserInfo | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}


const API_BASE = import.meta.env.VITE_API_URL || '';

export function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", "Bearer " + token);
  }
  return fetch(API_BASE + url, { ...options, headers });
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<UserInfo | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const resp = await fetch(API_BASE + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(err.detail || "Login failed");
    }
    const data = await resp.json();
    setToken(data.access_token);
    setUser({ username: data.username, display_name: data.display_name });
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify({ username: data.username, display_name: data.display_name }));
  }, []);

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(API_BASE + "/api/auth/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((resp) => {
        if (!resp.ok) logout();
        setLoading(false);
      })
      .catch(() => {
        logout();
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
