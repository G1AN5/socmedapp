// src/pages/HomePage.jsx

/**
 * HomePage Component
 * ------------------
 * Main feed page for authenticated users.
 * - Fetches and displays posts with infinite scroll.
 * - Shows left and right sidebars for navigation and post creation.
 * - Handles user authentication, logout, and post/reply creation.
 * - Highlights the active post as the user scrolls.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

import '../styles/HomePage.css';
import PostCard from '../components/PostCard';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';

export default function HomePage() {
  // --- State and refs ---
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null); // Current user info
  const [posts, setPosts] = useState([]);               // List of posts
  const [page, setPage] = useState(1);                  // Pagination page
  const [loading, setLoading] = useState(false);        // Loading state for posts
  const [hasMore, setHasMore] = useState(true);         // If more posts are available
  const [activePost, setActivePost] = useState(null);   // Currently active post (for highlighting)
  const [replyingTo, setReplyingTo] = useState(null);   // Post being replied to

  const API_URL = "https://supabase-socmed.vercel.app";
  const observer = useRef();            // For infinite scroll
  const postObserver = useRef();        // For active post highlighting
  const feedContainerRef = useRef(null);

  const authToken = localStorage.getItem("authToken");
  const authHeaders = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  // --- Fetch current user on mount ---
  useEffect(() => {
    if (!authToken) {
      navigate("/");
      return;
    }
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/user`, { headers: { 'Authorization': `Bearer ${authToken}` } });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        navigate("/");
      }
    };
    fetchCurrentUser();
  }, [authToken, navigate]);
  
  // --- Fetch posts when page or authToken changes ---
  useEffect(() => {
    const fetchPosts = async () => {
      if (!authToken) return;
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/post?page=${page}`, { headers: { 'Authorization': `Bearer ${authToken}` } });
        const newPosts = response.data;
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setHasMore(newPosts.length > 0);
        if (page === 1 && newPosts.length > 0) {
          setActivePost(newPosts[0]);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [page, authToken]); 

  // --- Infinite scroll: load more posts when last post is visible ---
  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);
  
  // --- Highlight active post as user scrolls ---
  useEffect(() => {
    postObserver.current = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.target.dataset.postId) {
                    const postId = Number(entry.target.dataset.postId);
                    const post = posts.find(p => p.id === postId);
                    if (post && post.id !== activePost?.id) {
                        setActivePost(post);
                    }
                }
            });
        },
        { threshold: 0.7 }
    );
    const postElements = document.querySelectorAll('.post-card-container');
    postElements.forEach(el => postObserver.current.observe(el));
    return () => { postObserver.current?.disconnect(); };
  }, [posts, activePost?.id]);

  // --- Handle new post creation ---
  const handlePostCreated = (newPostData) => {
    const newPostObject = newPostData[0];
    if (!newPostObject) {
      console.error("API response for new post is invalid:", newPostData);
      return;
    }
    const postWithUserData = {
        ...newPostObject,
        users: currentUser,
        likes: [{ count: 0 }],
        replies: [{ count: 0 }]
    };
    setPosts(prevPosts => [postWithUserData, ...prevPosts]);
    feedContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Toggle reply mode for a post ---
  const handleToggleReplyMode = (post) => {
    if (replyingTo && replyingTo.id === post.id) {
        setReplyingTo(null);
    } else {
        setReplyingTo(post);
    }
  };
  
  // --- Handle new reply creation ---
  const handleReplyCreated = (updatedPost) => {
      setPosts(prevPosts => prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
      setActivePost(updatedPost);
      setReplyingTo(null);
  };

  // --- Logout handler ---
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  // --- Render loading state if user not loaded ---
  if (!currentUser) {
    return <div style={{ textAlign: 'center', marginTop: '40px' }}>Loading Profile...</div>;
  }

  // --- Main render ---
  return (
    <div className="home-page-container">
      {/* Left sidebar: user info and navigation */}
      <LeftSidebar 
        activePost={activePost} 
        currentUser={currentUser} 
        authHeaders={authHeaders} 
        API_URL={API_URL}
        onLogout={handleLogout} 
      />
      
      {/* Main feed: posts */}
      <main className="main-feed">
        <div className="posts-feed-container" ref={feedContainerRef}>
          {posts.map((post, index) => {
             const postCardProps = {
                post: post,
                format: format,
                authHeaders: authHeaders,
                API_URL: API_URL,
                onToggleReply: handleToggleReplyMode,
                currentUser: currentUser,
             };
             if (posts.length === index + 1) {
                return <PostCard key={post.id} ref={lastPostElementRef} {...postCardProps} />;
             }
             return <PostCard key={post.id} {...postCardProps} />;
          })}
          {loading && <p style={{textAlign: "center", color: "#333"}}>Loading more posts...</p>}
          {!hasMore && posts.length > 0 && <p style={{textAlign: "center", color: "#333"}}>No more posts to show.</p>}
        </div>
      </main>

      {/* Right sidebar: post creation and reply */}
      <RightSidebar 
        currentUser={currentUser} 
        onPostCreated={handlePostCreated}
        replyingTo={replyingTo}
        onReplyCreated={handleReplyCreated}
        authHeaders={authHeaders} 
        API_URL={API_URL} 
      />
    </div>
  );
}