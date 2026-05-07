import { createContext, useContext, useState, type ReactNode } from "react";
import { clearAuthStorage } from "../utils/auth";

type AuthContextType = {
  token: string | null;
  role: string | null;
  login: (token: string, role: string, rememberMe: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  login: () => {},
  logout: () => {},
});

function readStorage(key: string): string | null {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => readStorage("token"));
  const [role, setRole] = useState<string | null>(() => readStorage("role"));

  function login(newToken: string, newRole: string, rememberMe: boolean) {
    const storage = rememberMe ? localStorage : sessionStorage;
    const other = rememberMe ? sessionStorage : localStorage;
    other.removeItem("token");
    other.removeItem("role");
    storage.setItem("token", newToken);
    storage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
  }

  function logout() {
    clearAuthStorage();
    setToken(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
