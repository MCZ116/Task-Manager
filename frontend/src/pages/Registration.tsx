import React, { useState } from "react";
import "../styles/LoginForm.css";
import { useAuth } from "../contexts/AuthProvider";

const Registration: React.FC = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await auth?.register({
      username,
      firstName,
      lastName,
      password,
    });
  };

  return (
    <div className="form-container">
      <h1>Register new account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Firstname:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Lastname:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create account</button>
        Have account already? <a href="/signin">Sign in</a>
      </form>
    </div>
  );
};

export default Registration;
