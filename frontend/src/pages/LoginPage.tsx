import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginForm.css";
import { useAuth } from "../contexts/AuthProvider";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await auth?.login(username, password);
    navigate("/dashboard");
  };

  return (
    <div className="form-container">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default LoginPage;
