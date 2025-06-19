// src/pages/HomePage.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

import '../styles/HomePage.css';
import PostCard from '../components/PostCard';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';

export default function HomePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activePost, setActivePost] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  const API_URL = "https://supabase-socmed.vercel.app";
  const observer = useRef();
  const postObserver = useRef();
  const feedContainerRef = useRef(null); 

  const authToken = localStorage.getItem("authToken");
  const authHeaders = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  // --- Data Fetching ---

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
  
  // --- DATA FETCHING LOGIC ---
  useEffect(() => {
    const fetchPosts = async () => {
      if (!authToken) return;
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/post?page=${page}`, { headers: { 'Authorization': `Bearer ${authToken}` } });
        const newPosts = response.data;
        
        // When appending new posts, use the functional update form of setState
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setHasMore(newPosts.length > 0);
        
        // This logic for setting the initial active post is now part of the same effect
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

  // --- Scrolling Observers ---

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

  // --- Event Handlers ---

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

  const handleToggleReplyMode = (post) => {
    if (replyingTo && replyingTo.id === post.id) {
        setReplyingTo(null);
    } else {
        setReplyingTo(post);
    }
  };
  
  const handleReplyCreated = (updatedPost) => {
      setPosts(prevPosts => prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
      setActivePost(updatedPost);
      setReplyingTo(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  // --- Render Logic ---

  if (!currentUser) {
    return <div style={{ textAlign: 'center', marginTop: '40px' }}>Loading Profile...</div>;
  }

  return (
    <div className="home-page-container">
      <LeftSidebar 
        activePost={activePost} 
        currentUser={currentUser} 
        authHeaders={authHeaders} 
        API_URL={API_URL}
        onLogout={handleLogout} 
      />
      
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