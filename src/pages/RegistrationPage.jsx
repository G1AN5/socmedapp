// src/pages/RegistrationPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/RegistrationPage.css";

export default function RegistrationPage() {
  const navigate = useNavigate();
  
  // --- State Management for Inputs ---
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState(""); // Added state for Last Name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const API_URL = "https://supabase-socmed.vercel.app";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // --- Updated Validation ---
    if (!fName || !lName || !email || !password || !confirmPassword) { // Check for lName
        setError("All fields are required.");
        return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // --- Updated API Parameters ---
      const params = new URLSearchParams();
      params.append('fName', fName);
      params.append('lName', lName); // Add lName to the request
      params.append('email', email);
      params.append('password', password);

      const response = await axios.post(`${API_URL}/register`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if (response.data.access_token) {
        localStorage.setItem("authToken", response.data.access_token);
        navigate("/home");
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Registration Error:", err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h1 className="register-title">
          QUICKEY
          <div className="register-underline"></div>
        </h1>
        <h2 className="register-here">Register Here</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          {/* --- Updated Form Fields --- */}
          <input 
            className="register-input" 
            type="text" 
            placeholder="First Name" // Changed placeholder
            value={fName}
            onChange={(e) => setFName(e.target.value)}
          />
          <input 
            className="register-input" 
            type="text" 
            placeholder="Last Name" // Added Last Name input
            value={lName}
            onChange={(e) => setLName(e.target.value)}
          />
          <input 
            className="register-input" 
            type="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            className="register-input" 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input 
            className="register-input" 
            type="password" 
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="register-proceed" type="submit">Proceed</button>
        </form>
      </div>
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