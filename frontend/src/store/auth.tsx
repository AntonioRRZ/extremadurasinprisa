import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { api } from "../api/client";
import { SessionPayload, User } from "../types/api";

type AuthContextValue = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { email: string; password: string; full_name: string; phone?: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "esp-session";

function saveSession(session: SessionPayload) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

function readSession(): SessionPayload | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as SessionPayload) : null;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const session = readSession();
      if (!session) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await api.get<User>("/me", session.access_token);
        setAccessToken(session.access_token);
        setRefreshToken(session.refresh_token);
        setUser(currentUser);
      } catch {
        try {
          const refreshed = await api.post<SessionPayload>("/auth/refresh", {
            refresh_token: session.refresh_token,
          });
          saveSession(refreshed);
          setAccessToken(refreshed.access_token);
          setRefreshToken(refreshed.refresh_token);
          setUser(refreshed.user);
        } catch {
          clearSession();
        }
      } finally {
        setLoading(false);
      }
    };
    void restore();
  }, []);

  const applySession = (session: SessionPayload) => {
    saveSession(session);
    setAccessToken(session.access_token);
    setRefreshToken(session.refresh_token);
    setUser(session.user);
  };

  const login = async (email: string, password: string) => {
    const session = await api.post<SessionPayload>("/auth/login", { email, password });
    applySession(session);
  };

  const register = async (payload: { email: string; password: string; full_name: string; phone?: string }) => {
    const session = await api.post<SessionPayload>("/auth/register", payload);
    applySession(session);
  };

  const logout = () => {
    clearSession();
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

