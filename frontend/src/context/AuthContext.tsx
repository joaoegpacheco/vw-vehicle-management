import { createContext, useState, ReactNode } from "react";
import API from "../api/api";
import { jwtDecode } from "jwt-decode";

interface User {
  name: string;
  isRoot: boolean;
}

interface AuthContextType {
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

  async function login(name: string, password: string) {
    const response = await API.post<LoginResponse>("/login", { name, password });
    const data = response.data; 
    localStorage.setItem("token", data.token);
    const decoded: any = jwtDecode(data.token);
    setUser({ name: decoded.name, isRoot: decoded.isRoot });
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
