// src/components/PostCard.jsx

/**
 * PostCard Component
 * ------------------
 * Displays a single post in the feed.
 * Features:
 * - Shows author info, post content, and post date.
 * - Displays like and comment (reply) actions.
 * - Allows the user to like/unlike the post (one like per account, persisted).
 * - Optimistically updates like count and state, with error handling.
 * - Shows the number of likes and comments.
 * - Uses a ref for infinite scroll and snap scrolling.
 */

import React, { useState } from 'react';
import axios from 'axios';
import './PostCard.css';
import { Heart, MessageSquare } from 'react-feather';

const PostCard = React.forwardRef(
  (
    { post, format, authHeaders, API_URL, onToggleReply },
    ref
  ) => {
    // State for like count, like status, and like request status
    const [likesCount, setLikesCount] = useState(post.likes[0]?.count || 0);
    const [isLiked, setIsLiked] = useState(false); // Visual state of the heart
    const [isLiking, setIsLiking] = useState(false); // Prevents spamming the like button

    /**
     * Handles like/unlike action.
     * Optimistically updates UI, sends request to backend, and reverts on error.
     */
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
        {/* Post header: profile picture, author info, date, actions */}
        <div className="post-header">
          <img src={post.users.profile_picture} alt="profile" className="post-profile-pic" />
          <div className="post-author-info">
            <div className="post-author-name">{post.users.fName} {post.users.lName}</div>
            <div className="post-date">{format(new Date(post.created_at), 'MMM d, yyyy')}</div>
          </div>
          <div className="post-actions">
            {/* Comment (reply) icon */}
            <MessageSquare
              size={24}
              color="#0b2839"
              onClick={() => onToggleReply(post)}
              style={{ cursor: 'pointer' }}
            />
            {/* Like (heart) icon */}
            <Heart
              size={24}
              onClick={handleLike}
              className={isLiked ? 'liked' : ''}
              style={{ cursor: isLiking ? 'wait' : 'pointer' }}
              disabled={isLiking}
            />
          </div>
        </div>
        {/* Post content */}
        <div className="post-content-box">
          <p>{post.content}</p>
        </div>
        {/* Post statistics: likes and comments */}
        <div className="post-stats">
          <span>{likesCount} Likes</span>
          <span>{post.replies[0]?.count || 0} Comments</span>
        </div>
      </div>
    );
  }
);

export default PostCard;