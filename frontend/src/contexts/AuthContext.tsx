import React, { createContext, useContext, useState, useCallback } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("cogtwin_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, _password: string) => {
    // Mock authentication
    const mockUser: User = {
      id: "usr_" + Math.random().toString(36).slice(2, 10),
      name: email.split("@")[0],
      email,
      joinedDate: new Date().toISOString(),
    };
    localStorage.setItem("cogtwin_user", JSON.stringify(mockUser));
    setUser(mockUser);
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string) => {
    const mockUser: User = {
      id: "usr_" + Math.random().toString(36).slice(2, 10),
      name,
      email,
      joinedDate: new Date().toISOString(),
    };
    localStorage.setItem("cogtwin_user", JSON.stringify(mockUser));
    setUser(mockUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("cogtwin_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
