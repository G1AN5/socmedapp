// src/pages/ProfilePage.jsx

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Importing the dedicated CSS file for this component.
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const userBearerToken = localStorage.getItem("authToken");
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const API_URL = "https://supabase-socmed.vercel.app";

  useEffect(() => {
    if (!userBearerToken) {
      navigate("/");
    }
  }, [userBearerToken, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/user`, {
          headers: { Authorization: `Bearer ${userBearerToken}` }
        });
        setUserData(Array.isArray(response.data) ? response.data[0] : response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        localStorage.removeItem("authToken");
        navigate("/");
      }
    };
    if (userBearerToken) {
      fetchData();
    }
  }, [userBearerToken, navigate]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profile", file);
    setUploading(true);
    try {
      const response = await axios.patch(
        `${API_URL}/user/profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userBearerToken}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      const updatedUser = Array.isArray(response.data) ? response.data[0] : response.data;
      setUserData((prevData) => ({
        ...prevData,
        profile_picture: updatedUser.profile_picture
      }));
    } catch (err) {
      console.error("Failed to update profile picture:", err);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  if (!userData) {
    return <div className="profile-loading">Loading Profile...</div>;
  }

  const username = userData.username || userData.email.split('@')[0];

  return (
    <div className="profile-page-container">
      <Link to="/home" className="back-to-home-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        <span>Back to Feed</span>
      </Link>
      <div className="profile-card-desktop">
        <div className="profile-pic-section">
          <img
            src={userData.profile_picture || 'https://placehold.co/160x160/ffefef/8c0e0f?text=User'}
            alt="Profile"
            className="profile-pic-large"
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/160x160/ffefef/8c0e0f?text=Error';
            }}
          />
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleProfilePicChange}
            disabled={uploading}
          />
          <button className="edit-profile-pic-btn" onClick={triggerFileInput} disabled={uploading}>
            {uploading ? "Uploading..." : "Change Picture"}
          </button>
        </div>
        <div className="profile-info-section">
          <h2>{userData.fName} {userData.lName}</h2>
          <p className="profile-username">@{username}</p>
          <p className="profile-email">{userData.email}</p>
          <div className="profile-actions">
            <button className="logout-btn" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;