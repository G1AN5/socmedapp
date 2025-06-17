// src/pages/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import "../styles/LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  // --- State Management for Inputs ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To display login errors

  // --- API Base URL ---
  const API_URL = "https://supabase-socmed.vercel.app";

  // --- Login Handler ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Validate inputs
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      // Create urlencoded form data
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('password', password);

      // Make POST request to the /sign-in endpoint
      const response = await axios.post(`${API_URL}/sign-in`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // On success, store the token and navigate
      if (response.data.access_token) {
        localStorage.setItem("authToken", response.data.access_token); // Store token
        navigate("/home"); // Navigate to a protected home page
      }
    } catch (err) {
      // Handle login errors
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      console.error("Login Error:", err);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Forgot password clicked!");
  };

  return (
    <div className="container">
      <div className="left-section">
        <h1 className="title">
          QUICKEY
          <div className="underline"></div>
        </h1>
        <p className="subtitle">
          <span>CONNECT WITH A</span>
          <br />
          <span>SINGLE TOUCH</span>
        </p>
      </div>
      <div className="right-section">
        <form className="auth-card" onSubmit={handleLogin}>
          {error && <p style={{ color: 'yellow' }}>{error}</p>} {/* Display error message */}
          <input
            className="input"
            type="email" // Changed type to email for better validation
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Controlled component
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Controlled component
          />
          <div className="forgot-row">
            <a
              className="forgot"
              href="#"
              tabIndex={0}
              onClick={handleForgotPassword}
            >
              Forgot password?
            </a>
          </div>
          <button className="login-btn" type="submit">Log In</button> {/* Changed to type="submit" */}
          <hr className="divider" />
          <div className="register-row">
            <span
              className="register"
              tabIndex={0}
              onClick={handleRegister}
              style={{ cursor: "pointer" }}
            >
              Register now!
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}