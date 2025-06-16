import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

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
              onClick={(e) => {
                e.preventDefault();
                alert("Forgot password clicked!");
              }}
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
              onClick={() => navigate("/register")}
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