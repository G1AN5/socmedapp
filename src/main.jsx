// src/main.jsx

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import HomePage from "./pages/HomePage"; 
import LikePosts from "./pages/LikePosts";
import ProfilePage from './pages/ProfilePage';
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/register" element={<ProfilePage />} />
          <Route path="/home" element={<HomePage />} /> 
          <Route path="/liked-posts" element={<LikedPosts />} />
        </Routes>
      </App>
    </Router>
  </React.StrictMode>
);
