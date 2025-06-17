// src/pages/HomePage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear the token
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="home-container">
      <h1>Welcome to QUICKEY!</h1>
      <p>You have successfully logged in.</p>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}