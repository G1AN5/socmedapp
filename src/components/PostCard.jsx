// src/components/PostCard.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './PostCard.css';
import { Heart, MessageSquare } from 'react-feather';

const PostCard = React.forwardRef(({ post, format, authHeaders, API_URL, onToggleReply }, ref) => {
    const [likesCount, setLikesCount] = useState(post.likes[0]?.count || 0);
    const [isLiked, setIsLiked] = useState(false); // Manages the visual state of the heart
    const [isLiking, setIsLiking] = useState(false); // Prevents spamming the like button

    const handleLike = async () => {
        if (isLiking) return; // Prevent action if a request is already in progress
        setIsLiking(true);

        const originalLikes = likesCount;
        const originalIsLiked = isLiked;

        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

        try {
            if (isLiked) {
                // If it was liked, now we unlike it
                await axios.delete(`${API_URL}/post/${post.id}/likes`, { headers: authHeaders });
            } else {
                // If it was not liked, now we like it
                await axios.post(`${API_URL}/post/${post.id}/likes`, {}, { headers: authHeaders });
            }
        } catch (error) {
            console.error("Failed to update like status:", error);
            // On error, revert the UI to its original state
            setIsLiked(originalIsLiked);
            setLikesCount(originalLikes);
            alert("Could not update like status. Please try again.");
        } finally {
            setIsLiking(false); 
        }
    };

    return (
        <div className="post-card-container" ref={ref} data-post-id={post.id}>
            <div className="post-header">
                <img src={post.users.profile_picture} alt="profile" className="post-profile-pic" />
                <div className="post-author-info">
                    <div className="post-author-name">{post.users.fName} {post.users.lName}</div>
                    <div className="post-date">{format(new Date(post.created_at), 'MMM d, yyyy')}</div>
                </div>
                <div className="post-actions">
                    <MessageSquare size={24} color="#0b2839" onClick={() => onToggleReply(post)} style={{ cursor: 'pointer' }} />
                    <Heart
                        size={24}
                        onClick={handleLike}
                        className={isLiked ? 'liked' : ''}
                        style={{ cursor: isLiking ? 'wait' : 'pointer' }} 
                        disabled={isLiking}
                    />
                </div>
            </div>
            <div className="post-content-box">
                <p>{post.content}</p>
            </div>
            <div className="post-stats">
                 <span>{likesCount} Likes</span>
                 <span>{post.replies[0]?.count || 0} Comments</span>
            </div>
        </div>
    );
});

export default PostCard;