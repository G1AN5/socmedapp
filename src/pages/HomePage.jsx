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

  const API_URL = "https://supabase-socmed.vercel.app";
  const observer = useRef();

  // Auth token and headers setup
  const authToken = localStorage.getItem("authToken");
  const authHeaders = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  // Fetch current user's data
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

  // Fetch posts
  const fetchPosts = useCallback(async () => {
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
  }, [page, authToken]);
  
  useEffect(() => {
    if (authToken) {
        fetchPosts();
    }
  }, [fetchPosts, authToken]);

  // Infinite scroll observer
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
  
  // Snap scroll observer for setting active post
  const postObserver = useRef();
  useEffect(() => {
      postObserver.current = new IntersectionObserver(
          (entries) => {
              entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                      const postId = Number(entry.target.dataset.postId);
                      const post = posts.find(p => p.id === postId);
                      if (post) {
                          setActivePost(post);
                      }
                  }
              });
          },
          { threshold: 0.7 }
      );
      const postElements = document.querySelectorAll('.post-card-container');
      postElements.forEach(el => postObserver.current.observe(el));
      return () => {
          if (postObserver.current) {
              postObserver.current.disconnect();
          }
      };
  }, [posts]);

  // Function to handle new post creation
  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear the token from storage
    navigate("/"); // Redirect to the login page
  };

  if (!currentUser) {
    return <div>Loading Profile...</div>;
  }

 return (
    <div className="home-page-container">
      {/* Pass the handleLogout function as a prop */}
      <LeftSidebar 
        activePost={activePost} 
        currentUser={currentUser} 
        authHeaders={authHeaders} 
        API_URL={API_URL}
        onLogout={handleLogout} 
      />
      <main className="main-feed">
        <div className="posts-feed-container">
          {posts.map((post, index) => {
             const postCardProps = {
                key: post.id,
                post: post,
                format,
                authHeaders: authHeaders,
                API_URL: API_URL,
                "data-post-id": post.id,
             };
             if (posts.length === index + 1) {
                return <PostCard ref={lastPostElementRef} {...postCardProps} />
             }
             return <PostCard {...postCardProps} />
          })}
          {loading && <p style={{textAlign: "center", color: "#333"}}>Loading more posts...</p>}
          {!hasMore && <p style={{textAlign: "center", color: "#333"}}>No more posts to show.</p>}
        </div>
      </main>

      <RightSidebar currentUser={currentUser} onPostCreated={handlePostCreated} authHeaders={authHeaders} API_URL={API_URL} />
    </div>
  );
}