import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProvider {
  children: React.ReactNode;
}

interface AuthUser {
  username: string;
  token: string;
}

interface RegisterUser {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  register: (registerData: RegisterUser) => Promise<void>;
  logout: () => void;
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
}

export function AuthProvider({ children }: AuthProvider) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials");
    }
  };

  const register = async (registerData: RegisterUser) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/register`,
        registerData
      );

      const { access_token, refresh_token } = response.data;
      setUser({ username: registerData.username, token: access_token });

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      navigate("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Invalid registration data");
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
    <AuthContext.Provider
      value={{ user, login, logout, register, avatarUrl, setAvatarUrl }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
