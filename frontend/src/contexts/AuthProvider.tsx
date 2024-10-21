import axios from "axios";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProvider {
  children: React.ReactNode;
}

interface AuthUser {
  username: string;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export function AuthProvider({ children }: AuthProvider) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(API_URL + "/api/auth/signin", {
        username,
        password,
      });
      setUser({
        username,
        token: response.data.access_token,
      });
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials");
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
