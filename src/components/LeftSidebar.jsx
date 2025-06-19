// src/components/LeftSidebar.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { LogOut, Trash2 } from 'react-feather'; 
import './LeftSidebar.css';

export default function LeftSidebar({ activePost, currentUser, authHeaders, API_URL, onLogout }) {
    const [replies, setReplies] = useState([]);
    
    useEffect(() => {
      const fetchReplies = async () => {
          if (!activePost) {
              setReplies([]); // Clear replies if no post is active
              return;
          }
          try {
              const response = await axios.get(`${API_URL}/post/${activePost.id}`, { headers: authHeaders });
              setReplies(response.data.replies || []);
          } catch (error) {
              console.error("Failed to fetch replies:", error);
              setReplies([]); // Clear replies on error
          }
      };
      fetchReplies();
    }, [activePost, API_URL, authHeaders]);

    const handleDeleteReply = async (replyId) => {
        if (!activePost) return;
        try {
            const response = await axios.delete(`${API_URL}/post/${activePost.id}/replies/${replyId}`, { headers: authHeaders });
            setReplies(response.data.replies || []);
        } catch (error) {
            console.error("Failed to delete reply:", error);
            alert("Could not delete reply.");
        }
    };

    return (
        <aside className="left-sidebar">
            <div className="logo-container">
              <h1 className="sidebar-logo-title">
                QUICKEY
                <div className="sidebar-logo-underline"></div>
              </h1>
            </div>
            
            <nav className="main-nav">
                <a href="#home">Home</a>
                <a href="#liked">Liked Posts</a>
                <a href="#myposts">My Posts</a>
                <a href="#" onClick={onLogout} className="logout-link">
                    <LogOut size={20} style={{ marginRight: '8px' }} />
                    Logout
                </a>
            </nav>

            <div className="replies-section">
                <div className="replies-header">Replies in Current Post</div>
                <div className="replies-list">
                    {replies.length > 0 ? replies.map(reply => (
                        <div key={reply.id} className="reply-card">
                            <div className="reply-header">
                                {reply.users && reply.users.profile_picture ? (
                                    <img 
                                        src={reply.users.profile_picture} 
                                        alt="profile" 
                                        className="reply-profile-pic" 
                                    />
                                ) : (
                                    <div className="reply-avatar-fallback">
                                        {reply.users ? reply.users.fName[0].toUpperCase() : '?'}
                                    </div>
                                )}
                                <div className="reply-author-info">
                                    <div className="reply-author-name">{reply.users?.fName} {reply.users?.lName}</div>
                                    <div className="reply-date">{format(new Date(reply.created_at), 'MMM d, yyyy')}</div>
                                </div>
                                {reply.users?.id === currentUser.id && (
                                    <Trash2 
                                        className="delete-reply-icon" 
                                        size={18} 
                                        onClick={() => handleDeleteReply(reply.id)} 
                                    />
                                )}
                            </div>
                            <p className="reply-content">{reply.content}</p>
                        </div>
                    )) : <p className="no-replies-text">No replies yet.</p>}
                </div>
            </div>
        </aside>
    );
}