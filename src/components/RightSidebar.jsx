// src/components/RightSidebar.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './RightSidebar.css';

export default function RightSidebar({ currentUser, onPostCreated, authHeaders, API_URL }) {
    const [content, setContent] = useState('');

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        const params = new URLSearchParams();
        params.append('content', content);

        try {
            const response = await axios.post(`${API_URL}/post`, params, { headers: authHeaders });
            onPostCreated(response.data); // Pass the new post up to the parent
            setContent(''); // Clear the textarea
        } catch (error) {
            console.error("Failed to create post:", error);
            alert("Could not create post.");
        }
    };

    return (
        <aside className="right-sidebar">
            <div className="profile-button-container">
                 <img src={currentUser.profile_picture} alt="My Profile" className="my-profile-pic" />
                 <span>Profile</span>
            </div>
            
            <form className="new-post-form" onSubmit={handlePostSubmit}>
                <div className="new-post-header">What's on your mind?</div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write something..."
                />
                <button type="submit">POST ➤</button>
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