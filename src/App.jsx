// App.jsx
/**
 * App Component
 * -------------
 * Root layout component that defines the main application routes.
 * Handles routing for all major pages:
 * - Login
 * - Registration
 * - Home (feed)
 * - Liked Posts
 * - My Posts
 * - Profile
 * 
 * Note: The Router should be defined only once at the root (usually in main.jsx).
 * This component should only define the <Routes> and <Route> structure.
 */

import "./App.css";
import { Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import LikedPosts from "./pages/LikedPosts";
import MyPosts from "./pages/MyPosts";
import RegistrationPage from "./pages/RegistrationPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/liked" element={<LikedPosts />} />
      <Route path="/myposts" element={<MyPostsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}
