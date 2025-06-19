// src/components/RightSidebar.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RightSidebar.css';

export default function RightSidebar({ currentUser, onPostCreated, replyingTo, onReplyCreated, authHeaders, API_URL }) {
    const [content, setContent] = useState('');
    const isReplying = !!replyingTo;

    // Clear content when switching modes
    useEffect(() => {
        setContent('');
    }, [isReplying]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        if (isReplying) {
            // --- Handle Reply Submission ---
            const params = new URLSearchParams();
            params.append('content', content);
            try {
                const response = await axios.post(`${API_URL}/post/${replyingTo.id}/replies`, params, { headers: authHeaders });
                // The API for creating a reply returns the UPDATED POST object.
                onReplyCreated(response.data);
            } catch (error) {
                console.error("Failed to create reply:", error);
                alert("Could not post reply.");
            }
        } else {
            // --- Handle New Post Submission ---
            const params = new URLSearchParams();
            params.append('content', content);
            try {
                const response = await axios.post(`${API_URL}/post`, params, { headers: authHeaders });
                onPostCreated(response.data);
            } catch (error) {
                console.error("Failed to create post:", error);
                alert("Could not create post.");
            }
        }
        setContent(''); // Clear the textarea on success
    };

    return (
        <aside className="right-sidebar">
            <div className="profile-button-container">
                 <img src={currentUser.profile_picture} alt="My Profile" className="my-profile-pic" />
                 <span>Profile</span>
            </div>
            
            <form className="new-post-form" onSubmit={handleSubmit}>
                <div className="new-post-header">
                    {isReplying ? `Replying to ${replyingTo.users.fName}` : "What's on your mind?"}
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={isReplying ? "Write a reply..." : "Write something..."}
                />
                <button type="submit">{isReplying ? 'REPLY ➤' : 'POST ➤'}</button>
            </form>

            <footer className="footer-links">
                <a href="#about">About</a>
                <a href="#privacy">Privacy</a>
                <a href="#legal">Legal</a>
                <a href="#help">Help</a>
            </footer>
        </aside>
    );
}