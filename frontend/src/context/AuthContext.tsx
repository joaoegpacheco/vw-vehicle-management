import { createContext, useState, useEffect, ReactNode } from "react";
import API from "../api/api";
import { jwtDecode } from "jwt-decode";

interface User {
  name: string;
  isRoot: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (name: string, password: string) => Promise<void>;
  logout: () => void;
}

interface LoginResponse {
  token: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{ name: string; isRoot: boolean; exp: number }>(token);
        
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({ name: decoded.name, isRoot: decoded.isRoot });
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        logout();
      }
    }
  }, []);

  async function login(name: string, password: string) {
    try {
      const response = await API.post<LoginResponse>("/login", { name, password });
      const data = response.data;
      localStorage.setItem("token", data.token);

      const decoded = jwtDecode<{ name: string; isRoot: boolean }>(data.token);
      setUser({ name: decoded.name, isRoot: decoded.isRoot });
    } catch (error) {
      console.error("Erro no login:", error);
      throw new Error("Falha ao autenticar. Verifique suas credenciais.");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
