// src/components/RightSidebar.jsx

/**
 * RightSidebar Component
 * ----------------------
 * Displays the right sidebar for profile access, post creation, and replying.
 * Features:
 * - Shows a profile button with the user's profile picture.
 * - Allows the user to create a new post or reply to an existing post.
 * - Handles form submission for both new posts and replies.
 * - Clears the input field when switching between post and reply modes.
 * - Displays footer links for About, Privacy, Legal, and Help.
 * 
 * Props:
 * - currentUser: The currently authenticated user object.
 * - onPostCreated: Callback for when a new post is created.
 * - replyingTo: The post object being replied to (if any).
 * - onReplyCreated: Callback for when a reply is created.
 * - authHeaders: Authorization headers for API requests.
 * - API_URL: Base URL for the backend API.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './RightSidebar.css';

export default function RightSidebar({ currentUser, onPostCreated, replyingTo, onReplyCreated, authHeaders, API_URL }) {
    // State for the content of the textarea (post or reply)
    const [content, setContent] = useState('');
    // Boolean: true if replying to a post, false if creating a new post
    const isReplying = !!replyingTo;

    /**
     * Clears the content input when switching between post and reply modes.
     */
    useEffect(() => {
        setContent('');
    }, [isReplying]);

    /**
     * Handles form submission for both new posts and replies.
     * Sends the appropriate API request and calls the relevant callback.
     */
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
            {/* Profile button with user's profile picture */}
            <Link to="/profile" className="profile-button-container">
                <img src={currentUser.profile_picture} alt="My Profile" className="my-profile-pic" />
                <span>Profile</span>
            </Link>
            
            {/* New post or reply form */}
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

            {/* Footer links */}
            <footer className="footer-links">
                <a href="#about">About</a>
                <a href="#privacy">Privacy</a>
                <a href="#legal">Legal</a>
                <a href="#help">Help</a>
            </footer>
        </aside>
    );
}