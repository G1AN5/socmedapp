/**
 * ProfilePage Component
 * ---------------------
 * Displays the user's profile information, including:
 * - Profile picture, name, email, and a static bio.
 * - Profile statistics (posts, followers, following).
 * - A grid of photo placeholders.
 * - Buttons for editing the profile picture, messaging, and logging out.
 * 
 * Fetches user data from the backend using the stored auth token.
 * Redirects to the login page on logout.
 */

import React, { useEffect, useState } from 'react';
import "../styles/ProfilePage.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  // Retrieve the user's auth token from localStorage
  const userBearerToken = localStorage.getItem("authToken");
  // State to hold user data fetched from the backend
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const API_URL = "https://supabase-socmed.vercel.app";

  /**
   * Logs the user out by removing the auth token and redirecting to login.
   */
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  /**
   * Fetch user data from the backend API on component mount.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${userBearerToken}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [userBearerToken]);

  return (
    <div className="profile-wrapper">
      {/* Cover photo section */}
      <div className="cover-photo" />
      <div className="profile-main">
        {/* Profile picture */}
        <img
          src={
            userData.profile_picture === null
              ? "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/156ab531948059.5667f5a6a1995.png"
              : userData.profile_picture
          }
          alt="Profile"
          className="profile-pic"
        />
        <div className="profile-info">
          {/* User's full name */}
          <h2 className="profile-name">{userData.fName + " " + userData.lName}</h2>
          {/* User's email as username */}
          <p className="profile-username">@{userData.email}</p>
          {/* Static bio */}
          <p className="profile-bio">
            BSComputer Science | Gamer | Mapúa University 🎓
          </p>
          {/* Profile action buttons */}
          <div className="profile-actions">
            <button className="edit-btn">Edit Profile Picture</button>
            <button className="message-btn">Message</button>
            <button
              className="message-btn"
              style={{ backgroundColor: "RED" }}
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Profile statistics (static values for now) */}
      <div className="profile-stats">
        <div>
          <strong>1k</strong>
          <span>Posts</span>
        </div>
        <div>
          <strong>10k</strong>
          <span>Followers</span>
        </div>
        <div>
          <strong>500</strong>
          <span>Following</span>
        </div>
      </div>

      {/* Photo grid (placeholders) */}
      <div className="profile-photos">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="photo-placeholder" />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
