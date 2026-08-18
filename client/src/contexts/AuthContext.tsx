import { type ExternalIdentity, providerLoginUrl, resolveAuthConfig } from "@/lib/auth-client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AuthStatus = "idle" | "loading" | "ready" | "error";

interface AuthContextValue {
  authAvailable: boolean;
  signIn: (provider: ExternalIdentity["provider"]) => void;
  signOut: () => Promise<void>;
  status: AuthStatus;
  user: ExternalIdentity | null;
}

const config = resolveAuthConfig(import.meta.env.VITE_AUTH_ENABLED, import.meta.env.VITE_AUTH_ORIGIN);
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(config.enabled ? "loading" : "idle");
  const [user, setUser] = useState<ExternalIdentity | null>(null);

  const loadSession = useCallback(async () => {
    if (!config.enabled) return;
    try {
      const response = await fetch(`${config.authOrigin}/v1/session`, { credentials: "include" });
      if (!response.ok) throw new Error("Session request failed");
      const payload = (await response.json()) as { session: ExternalIdentity | null };
      setUser(payload.session);
      setStatus("ready");
    } catch {
      setUser(null);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const signIn = useCallback((provider: ExternalIdentity["provider"]) => {
    if (!config.enabled) return;
    window.location.assign(providerLoginUrl(config.authOrigin, provider));
  }, []);

  const signOut = useCallback(async () => {
    if (!config.enabled) return;
    setStatus("loading");
    try {
      await fetch(`${config.authOrigin}/v1/logout`, { credentials: "include", method: "POST" });
    } finally {
      setUser(null);
      setStatus("ready");
    }
  }, []);

  const value = useMemo(() => ({ authAvailable: config.enabled, signIn, signOut, status, user }), [signIn, signOut, status, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
