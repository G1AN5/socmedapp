// src/main.jsx

/**
 * Main entry point for the React application.
 * -------------------------------------------
 * - Initializes the React root and renders the app.
 * - Sets up the BrowserRouter for client-side routing.
 * - Defines the main application routes:
 *    - "/"           : LoginPage
 *    - "/register"   : RegistrationPage
 *    - "/profile"    : ProfilePage
 *    - "/home"       : HomePage (main feed)
 *    - "/liked"      : LikedPosts (user's liked posts)
 * - Global styles are imported from index.css.
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import HomePage from "./pages/HomePage";
import LikedPosts from "./pages/LikedPosts";
import ProfilePage from "./pages/ProfilePage";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/liked" element={<LikedPosts />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
