/**
 * MyPostsPage Component
 * ---------------------
 * Displays a feed of posts created by the currently authenticated user.
 * Features:
 * - Fetches and displays only the user's own posts with infinite scroll.
 * - Shows left and right sidebars for navigation and post creation.
 * - Handles user authentication, logout, and post/reply creation.
 * - Highlights the active post as the user scrolls.
 * - Uses IntersectionObserver for infinite scroll and active post highlighting.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

import '../styles/HomePage.css';
import PostCard from '../components/PostCard';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';

export default function MyPostsPage() {
  // --- State and refs ---
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null); // Current user info
  const [posts, setPosts] = useState([]);               // List of user's posts
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

  /**
   * Fetches the current user's data on mount.
   * Redirects to login if not authenticated.
   */
  useEffect(() => {
    if (!authToken) {
      navigate("/");
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/user`, { headers: authHeaders });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        navigate("/");
      }
    };
    fetchCurrentUser();
  }, [authToken, navigate]);

  /**
   * Fetches posts for the current user and page.
   * Appends new posts to the existing list.
   */
  useEffect(() => {
    const fetchPosts = async () => {
      if (!authToken || !currentUser) return;
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/post?page=${page}`, { headers: authHeaders });
        const allPosts = response.data;
        // Filter posts to only those created by the current user
        const userPosts = allPosts.filter(post => post.user_id === currentUser.id);

        setPosts(prev => [...prev, ...userPosts]);
        setHasMore(userPosts.length > 0);

        if (page === 1 && userPosts.length > 0) {
          setActivePost(userPosts[0]);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [page, authToken, currentUser]);

  /**
   * Infinite scroll observer: loads more posts when the last post is visible.
   */
  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  /**
   * Snap scroll observer: sets the active post based on scroll position.
   */
  useEffect(() => {
    postObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
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
    return () => postObserver.current?.disconnect();
  }, [posts, activePost?.id]);

  /**
   * Handles new post creation by prepending it to the posts list.
   */
  const handlePostCreated = (newPostData) => {
    const newPost = newPostData[0];
    if (!newPost) return;

    const postWithUserData = {
      ...newPost,
      users: currentUser,
      likes: [{ count: 0 }],
      replies: [{ count: 0 }]
    };

    if (newPost.user_id === currentUser.id) {
      setPosts(prev => [postWithUserData, ...prev]);
    }

    feedContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Toggles reply mode for a post.
   */
  const handleToggleReplyMode = (post) => {
    setReplyingTo(prev => (prev && prev.id === post.id ? null : post));
  };

  /**
   * Handles new reply creation by updating the relevant post.
   */
  const handleReplyCreated = (updatedPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    setActivePost(updatedPost);
    setReplyingTo(null);
  };

  /**
   * Handles user logout: clears token and redirects to login.
   */
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  // Show loading state while fetching user
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

      {/* Main feed: user's posts */}
      <main className="main-feed">
        <div className="posts-feed-container" ref={feedContainerRef}>
          {posts.map((post, index) => {
            const postCardProps = {
              post,
              format,
              authHeaders,
              API_URL,
              onToggleReply: handleToggleReplyMode,
              currentUser
            };
            return posts.length === index + 1
              ? <PostCard key={post.id} ref={lastPostElementRef} {...postCardProps} />
              : <PostCard key={post.id} {...postCardProps} />;
          })}
          {loading && <p style={{textAlign: "center", color: "#333"}}>Loading your posts...</p>}
          {!hasMore && posts.length > 0 && <p style={{textAlign: "center", color: "#333"}}>No more posts to show.</p>}
          {!loading && posts.length === 0 && <p style={{textAlign: "center", color: "#333"}}>You haven't posted anything yet.</p>}
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
