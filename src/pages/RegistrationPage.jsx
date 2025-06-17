// src/pages/RegistrationPage.jsx

/**
 * RegistrationPage Component
 * -------------------------
 * This component renders the registration form for new users.
 * It collects user details (first name, last name, email, password, confirm password),
 * validates the input, and sends a registration request to the backend API.
 * On successful registration, the user is redirected to the home page.
 * Errors are displayed above the form.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegistrationPage.css";

export default function RegistrationPage() {
  const navigate = useNavigate();

  // --- State Management for Inputs ---
  const [fName, setFName] = useState(""); // First Name
  const [lName, setLName] = useState(""); // Last Name
  const [email, setEmail] = useState(""); // Email
  const [password, setPassword] = useState(""); // Password
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm Password
  const [error, setError] = useState(""); // Error message

  // --- API Base URL ---
  const API_URL = "https://supabase-socmed.vercel.app";

  /**
   * Handles form submission for registration.
   * Validates input fields, sends a POST request to the backend,
   * and handles the response.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // --- Input Validation ---
    if (!fName || !lName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // --- Prepare form data for API ---
      const params = new URLSearchParams();
      params.append('fName', fName);
      params.append('lName', lName);
      params.append('email', email);
      params.append('password', password);

      // --- Send registration request to backend ---
      const response = await axios.post(`${API_URL}/register`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // --- Handle successful registration ---
      if (response.data.access_token) {
        localStorage.setItem("authToken", response.data.access_token);
        navigate("/home");
      }

    } catch (err) {
      // --- Handle registration errors ---
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Registration Error:", err);
    }
  };

  return (
    <div className="register-container">
      {/* Left section: Registration form */}
      <div className="register-left">
        <h1 className="register-title">
          QUICKEY
          <div className="register-underline"></div>
        </h1>
        <h2 className="register-here">Register Here</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          {/* Display error message if any */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* First Name input */}
          <input 
            className="register-input" 
            type="text" 
            placeholder="First Name"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
          />
          {/* Last Name input */}
          <input 
            className="register-input" 
            type="text" 
            placeholder="Last Name"
            value={lName}
            onChange={(e) => setLName(e.target.value)}
          />
          {/* Email input */}
          <input 
            className="register-input" 
            type="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* Password input */}
          <input 
            className="register-input" 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Confirm Password input */}
          <input 
            className="register-input" 
            type="password" 
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {/* Submit button */}
          <button className="register-proceed" type="submit">Proceed</button>
        </form>
      </div>
      {/* Right section: Terms and Conditions */}
      <div className="register-right">
        <div className="register-terms">
          <h3>Terms and Conditions:</h3>
          <div className="register-terms-content">
            <p>By registering, you agree to our terms of service and privacy policy.</p>
            <p>Your data is securely handled and will not be shared with third parties without your consent.</p>
          </div>
        </div>
      </div>
    </div>
  );
}