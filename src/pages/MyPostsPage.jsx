/**
 * MyPostsPage Component
 * ---------------------
 * Displays only the posts created by the current user.
 * - Fetches and displays only the user's own posts with infinite scroll.
 * - Uses the same layout and styles as HomePage for consistency.
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
  const [posts, setPosts] = useState([]);               // Only my posts
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
        const response = await axios.get(`${API_URL}/user`, { headers: { 'Authorization': `Bearer ${authToken}` } });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        navigate("/");
      }
    };
    fetchCurrentUser();
  }, [authToken, navigate]);

  /**
   * Fetches only the posts created by the current user.
   * Appends new posts to the existing list.
   */
  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!authToken || !currentUser) return;
      setLoading(true);
      try {
        // Fetch all posts for the current page
        const response = await axios.get(`${API_URL}/post?page=${page}`, { headers: authHeaders });
        // Filter posts to only those created by the current user
        const myPosts = response.data.filter(post => post.user_id === currentUser.id);
        setPosts(prevPosts => [...prevPosts, ...myPosts]);
        setHasMore(myPosts.length > 0);
        if (page === 1 && myPosts.length > 0) setActivePost(myPosts[0]);
      } catch (error) {
        console.error("Failed to fetch my posts:", error);
      }
      setLoading(false);
    };
    fetchMyPosts();
  }, [page, authToken, currentUser]);

  /**
   * Infinite scroll observer: loads more posts when the last post is visible.
   */
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

  /**
   * Snap scroll observer: sets the active post based on scroll position.
   */
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

  /**
   * Handles new post creation by prepending it to the posts list.
   * Only adds the post if it belongs to the current user.
   */
  const handlePostCreated = (newPostData) => {
    const newPostObject = newPostData[0];
    if (!newPostObject) {
      console.error("API response for new post is invalid:", newPostData);
      return;
    }
    // Only add the post if it belongs to the current user
    if (newPostObject.user_id === currentUser.id) {
      const postWithUserData = {
        ...newPostObject,
        users: currentUser,
        likes: [{ count: 0 }],
        replies: [{ count: 0 }]
      };
      setPosts(prevPosts => [postWithUserData, ...prevPosts]);
      feedContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Toggles reply mode for a post.
   */
  const handleToggleReplyMode = (post) => {
    if (replyingTo && replyingTo.id === post.id) {
      setReplyingTo(null);
    } else {
      setReplyingTo(post);
    }
  };

  /**
   * Handles new reply creation by updating the relevant post.
   */
  const handleReplyCreated = (updatedPost) => {
    setPosts(prevPosts => prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
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

      {/* Main feed: my posts only */}
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
          {loading && <p style={{ textAlign: "center", color: "#333" }}>Loading your posts...</p>}
          {!hasMore && posts.length > 0 && <p style={{ textAlign: "center", color: "#333" }}>No more posts to show.</p>}
          {!loading && posts.length === 0 && <p style={{ textAlign: "center", color: "#333" }}>You haven't posted anything yet.</p>}
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
