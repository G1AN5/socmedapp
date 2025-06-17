// LoginPage.jsx
// This page displays the login form for the application.
// It includes navigation to the registration page and a placeholder for "Forgot password?"

import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  // Handler for "Forgot password?" link (currently just an alert)
  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Forgot password clicked!");
  };

  // Handler for "Register now!" link (navigates to registration page)
  const handleRegister = () => {
    navigate("/register");
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
        <div className="auth-card">
          <input
            className="input"
            type="text"
            placeholder="Username or email"
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
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
          <button className="login-btn">Log In</button>
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
        </div>
      </div>
    </div>
  );
}