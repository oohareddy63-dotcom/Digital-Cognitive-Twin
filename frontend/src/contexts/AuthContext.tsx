import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { authApi, type ApiUser } from "@/lib/api";
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  baseline?: ApiUser["baseline"];
  streak?: ApiUser["streak"];
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  backendOnline: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

function apiUserToUser(u: ApiUser): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    joinedDate: u.joinedDate,
    baseline: u.baseline,
    streak: u.streak,
  };
}
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]               = useState<User | null>(null);
  const [loading, setLoading]         = useState(true);
  const [backendOnline, setBackendOnline] = useState(true);

  // On mount: verify stored token
  useEffect(() => {
    const token = localStorage.getItem("cogtwin_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(({ user: u }) => {
        setUser(apiUserToUser(u));
        setBackendOnline(true);
      })
      .catch((err: Error) => {
        // If backend is unreachable, keep the cached user from localStorage
        if (err.message.includes("Cannot connect") || err.message.includes("timed out")) {
          setBackendOnline(false);
          // Try to restore from localStorage cache
          const cached = localStorage.getItem("cogtwin_user_cache");
          if (cached) {
            try { setUser(JSON.parse(cached)); } catch { /* ignore */ }
          }
        } else {
          // Token invalid/expired — clear it
          localStorage.removeItem("cogtwin_token");
          localStorage.removeItem("cogtwin_user_cache");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: u } = await authApi.login(email, password);
    localStorage.setItem("cogtwin_token", token);
    const mapped = apiUserToUser(u);
    localStorage.setItem("cogtwin_user_cache", JSON.stringify(mapped));
    setUser(mapped);
    setBackendOnline(true);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { token, user: u } = await authApi.register(name, email, password);
    localStorage.setItem("cogtwin_token", token);
    const mapped = apiUserToUser(u);
    localStorage.setItem("cogtwin_user_cache", JSON.stringify(mapped));
    setUser(mapped);
    setBackendOnline(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("cogtwin_token");
    localStorage.removeItem("cogtwin_user_cache");
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { user: u } = await authApi.me();
      const mapped = apiUserToUser(u);
      localStorage.setItem("cogtwin_user_cache", JSON.stringify(mapped));
      setUser(mapped);
      setBackendOnline(true);
    } catch {
      // ignore refresh errors silently
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        backendOnline,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
