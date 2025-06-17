// src/pages/LoginPage.jsx

/**
 * LoginPage Component
 * -------------------
 * Renders the login form for existing users.
 * Collects user credentials (email and password), validates input,
 * and sends a login request to the backend API.
 * On successful login, redirects to the home page and stores the access token.
 * Errors are displayed above the form.
 * Includes navigation to the registration page and a placeholder for "Forgot password?".
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< Updated upstream
import axios from "axios"; // Import axios
import "./LoginPage.css";
=======
import axios from "axios";
import "../styles/LoginPage.css";
>>>>>>> Stashed changes

export default function LoginPage() {
  const navigate = useNavigate();

  // --- State Management for Inputs ---
  const [email, setEmail] = useState(""); // Email input
  const [password, setPassword] = useState(""); // Password input
  const [error, setError] = useState(""); // Error message

  // --- API Base URL ---
  const API_URL = "https://supabase-socmed.vercel.app";

  /**
   * Handles form submission for login.
   * Validates input fields, sends a POST request to the backend,
   * and handles the response.
   */
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
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      // Handle login errors
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      console.error("Login Error:", err);
    }
  };

  /**
   * Navigates to the registration page.
   */
  const handleRegister = () => {
    navigate("/register");
  };

  /**
   * Handles "Forgot password?" click.
   * Currently shows an alert as a placeholder.
   */
  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Forgot password clicked!");
  };

  return (
    <div className="container">
      {/* Left section: Branding and tagline */}
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
      {/* Right section: Login form */}
      <div className="right-section">
        <form className="auth-card" onSubmit={handleLogin}>
          {/* Display error message if any */}
          {error && <p style={{ color: 'yellow' }}>{error}</p>}
          {/* Email input */}
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* Password input */}
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Forgot password link */}
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
          {/* Login button */}
          <button className="login-btn" type="submit">Log In</button>
          <hr className="divider" />
          {/* Register link */}
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