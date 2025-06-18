// src/components/PostCard.jsx

import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import './PostCard.css';
import { Heart, MessageSquare } from 'react-feather';

const PostCard = React.forwardRef(({ post, format, authHeaders, API_URL, currentUser, ...props }, ref) => {
    const [likesCount, setLikesCount] = useState(post.likes[0]?.count || 0);
    const [isLiked, setIsLiked] = useState(false); // State to track if current user liked the post

    // Check if the current user has liked this post
    useEffect(() => {
        if (post.likes && currentUser) {

        }
    }, [post.likes, currentUser]);


    const handleLike = async () => {
        try {
            setLikesCount(prev => prev + 1);
            setIsLiked(true);
            await axios.post(`${API_URL}/post/${post.id}/likes`, {}, { headers: authHeaders });
        } catch (error) {
            if (error.response && error.response.status === 409) {
                // If already liked, unlike it
                try {
                    setLikesCount(prev => prev - 1);
                    setIsLiked(false);
                    await axios.delete(`${API_URL}/post/${post.id}/likes`, { headers: authHeaders });
                } catch (err) {
                    console.error("Unlike error:", err);
                    setLikesCount(prev => prev + 1); 
                    setIsLiked(true);
                }
            } else {
                console.error("Like error:", error);
                setLikesCount(prev => prev - 1); 
                setIsLiked(false);
            }
        }
    };

    return (
        <div className="post-card-container" ref={ref} {...props}>
            <div className="post-header">
                <img src={post.users.profile_picture} alt="profile" className="post-profile-pic" />
                <div className="post-author-info">
                    <div className="post-author-name">{post.users.fName} {post.users.lName}</div>
                    <div className="post-date">{format(new Date(post.created_at), 'MMM d, yyyy')}</div>
                </div>
                <div className="post-actions">
                    <MessageSquare size={24} color="#0b2839" />
                    <Heart 
                        size={24} 
                        onClick={handleLike} 
                        className={isLiked ? 'liked' : ''}
                        style={{ cursor: 'pointer' }}
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