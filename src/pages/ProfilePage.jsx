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
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const API_URL = "https://supabase-socmed.vercel.app";

  console.log("ProfilePage rendering, token:", userBearerToken ? "exists" : "missing");

  useEffect(() => {
    if (!userBearerToken) {
      navigate("/");
      return;
    }
  }, [userBearerToken, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userBearerToken) return;
      
      try {
        console.log("Fetching user data...");
        const response = await axios.get(`${API_URL}/user`, {
          headers: { Authorization: `Bearer ${userBearerToken}` }
        });
        console.log("User data response:", response.data);
        setUserData(Array.isArray(response.data) ? response.data[0] : response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to load user data");
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("authToken");
          navigate("/");
        }
      }
    };
    
    fetchData();
  }, [userBearerToken, navigate]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append("profile", file);
    
    setUploading(true);
    setError(null);
    
    try {
      console.log("Uploading file:", file.name);
      
      const response = await axios.patch(
        `${API_URL}/user/profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userBearerToken}`,
          },
          timeout: 30000,
        }
      );
      
      console.log("Upload response:", response.data);
      
      const updatedUser = Array.isArray(response.data) ? response.data[0] : response.data;
      
      setUserData((prevData) => ({
        ...prevData,
        profile_picture: updatedUser.profile_picture
      }));

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (err) {
      console.error("Upload failed:", err);
      
      if (err.response) {
        setError(`Upload failed: ${err.response.data?.message || err.response.statusText}`);
      } else if (err.request) {
        setError('Upload failed: No response from server');
      } else {
        setError('Upload failed: ' + err.message);
      }
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/160x160/ffefef/8c0e0f?text=Error';
  };

  // Show loading state
  if (!userData) {
    return <div className="profile-loading">Loading Profile...</div>;
  }

  const username = userData.username || (userData.email ? userData.email.split('@')[0] : 'user');
  const profilePicUrl = userData.profile_picture;

  return (
    <div className="profile-page-container">
      <Link to="/home" className="back-to-home-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        <span>Back to Feed</span>
      </Link>
      
      <div className="profile-card-desktop">
        <div className="profile-pic-section">
          <img
            src={profilePicUrl || 'https://placehold.co/160x160/ffefef/8c0e0f?text=User'}
            alt="Profile"
            className="profile-pic-large"
            onError={handleImageError}
            key={profilePicUrl}
          />
          
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleProfilePicChange}
            disabled={uploading}
          />
          
          <button 
            className="edit-profile-pic-btn" 
            onClick={triggerFileInput} 
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Change Picture"}
          </button>
          
          {error && (
            <div style={{
              color: '#8c0e0f', 
              marginTop: '10px', 
              fontSize: '14px',
              textAlign: 'center',
              padding: '8px',
              backgroundColor: '#fde2e2',
              borderRadius: '8px',
              border: '1px solid #fca5a5'
            }}>
              {error}
            </div>
          )}
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