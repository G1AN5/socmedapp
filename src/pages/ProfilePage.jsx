import React, { useEffect, useState } from 'react';
import "../styles/ProfilePage.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {

  const userBearerToken = localStorage.getItem("authToken")
  const [userData, setUserData] = useState({})
  const navigate = useNavigate()
  const API_URL = "https://supabase-socmed.vercel.app";


    const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear the token
      navigate("/"); // Redirect to login page
    };

    useEffect(()=>{
      const fetchData = async() =>{
        try {
          const response = await axios.get(`${API_URL}/user`,{
          headers: {
            Authorization: `Bearer ${userBearerToken}`
          }
        })
          setUserData(response.data)
          console.log(typeof response.data.profile_picture)
        } catch (error) {
          console.error(error)
        }
        
        
      }
        fetchData()
      },[])

  return (
    <div className="profile-wrapper">
      <div className="cover-photo" />
      <div className="profile-main">
        <img
          src={userData.profile_picture === null ? "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/156ab531948059.5667f5a6a1995.png" : userData.profile_picture}
          alt="Profile"
          className="profile-pic"
        />
        <div className="profile-info">
          <h2 className="profile-name">{userData.fName + " " + userData.lName}</h2>
          <p className="profile-username">@{userData.email}</p>
          <p className="profile-bio">
            BSComputer Science | Gamer | Mapúa University 🎓
          </p>
          <div className="profile-actions">
            <button className="edit-btn">Edit Profile Picture</button>
            <button className="message-btn">Message</button>
            <button className="message-btn" style={{backgroundColor: "RED"}} onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div><strong>1k</strong><span>Posts</span></div>
        <div><strong>10k</strong><span>Followers</span></div>
        <div><strong>500</strong><span>Following</span></div>
      </div>

      <div className="profile-photos">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="photo-placeholder" />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
