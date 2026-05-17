import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { io } from 'socket.io-client';
import './Allpost.css';

const Allpost = () => {
  const [uploads, setUploads] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [showComments, setShowComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const token = localStorage.getItem('token');
  
  // Get current user info for commenting and liking
  const userInfoStr = localStorage.getItem('Info');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  const currentRollNo = userInfo?.rollNo || "";
  const currentName = userInfo?.name || "Student/Alumni";

  const MAX_LENGTH = 1000;

  const fetchUploads = async () => {
    try {
      const response = await axios.get('/api/alluploads');
      setUploads(response.data);
    } catch (error) {
      console.error('Error fetching uploads:', error);
    }
  };

  useEffect(() => {
    fetchUploads();

    // Connect to WebSocket
    const socket = io(window.location.hostname === 'localhost' ? '' : '');

    socket.on('postCreated', (newPost) => {
      setUploads(prev => [newPost, ...prev]);
    });

    socket.on('postUpdated', (updatedPost) => {
      setUploads(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
    });

    socket.on('postDeleted', (deletedPostId) => {
      setUploads(prev => prev.filter(p => p._id !== deletedPostId));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleExpand = (id) => {
    setExpandedItems(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };

  const toggleComments = (id) => {
    setShowComments(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };

  const handleLike = async (postId) => {
    if (!token) return alert("Please sign in to like posts.");
    try {
      // Optimistic update
      setUploads(uploads.map(post => {
        if (post._id === postId) {
          const hasLiked = post.likes.includes(currentRollNo);
          const newLikes = hasLiked 
            ? post.likes.filter(r => r !== currentRollNo) 
            : [...post.likes, currentRollNo];
          return { ...post, likes: newLikes };
        }
        return post;
      }));

      await axios.post(`/api/posts/${postId}/likes`, { token, rollNo: currentRollNo });
    } catch (error) {
      console.error('Error liking post:', error);
      fetchUploads(); // Revert on failure
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!token) return alert("Please sign in to comment.");
    const text = commentText[postId];
    if (!text || text.trim() === '') return;

    try {
      // Optimistic update
      const newComment = { content: text, author: currentName, rollNo: currentRollNo, createdAt: new Date() };
      setUploads(uploads.map(post => {
        if (post._id === postId) {
          return { ...post, comments: [...(post.comments || []), newComment] };
        }
        return post;
      }));
      setCommentText({ ...commentText, [postId]: '' });

      await axios.post('/api/comments', {
        postId,
        content: text,
        author: currentName,
        rollNo: currentRollNo
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      fetchUploads(); // Revert on failure
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      // Optimistic update
      setUploads(uploads.filter(post => post._id !== postId));
      
      await axios.post(`/api/posts/${postId}/delete`, { token });
    } catch (error) {
      console.error('Error deleting post:', error);
      alert("Failed to delete post.");
      fetchUploads(); // Revert on failure
    }
  };

  return (
    <div className="allpost-container">
      {uploads.length === 0 ? (
        <p style={{textAlign:'center', color:'#94a3b8', padding:'20px 0'}}>No posts yet — be the first to share! ✨</p>
      ) : (
        <ul className="allpost-upload-list">
          {uploads.map((upload) => {
            const hasLiked = upload.likes?.includes(currentRollNo);
            const likesCount = upload.likes?.length || 0;
            const commentsCount = upload.comments?.length || 0;

            return (
              <li key={upload._id} className="allpost-item">
                <div className="allpost-header">
                  <Link to={`/getprofile/${upload.rollNo}`} className="allpost-profile-link">
                    <div className="allpost-avatar">
                      {upload.authorImage ? (
                        <img src={`/uploads/${upload.authorImage}`} alt="" />
                      ) : (
                        upload.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="allpost-name-meta">
                      <span className="allpost-name">{upload.name}</span>
                      <span className="allpost-timestamp">{moment(upload.createdAt).fromNow()}</span>
                    </div>
                  </Link>
                  
                  {currentRollNo === upload.rollNo && (
                    <button 
                      className="allpost-delete-btn" 
                      onClick={() => handleDelete(upload._id)}
                      title="Delete Post"
                    >
                      🗑️
                    </button>
                  )}
                </div>
                
                <div className="allpost-content">
                  <p>
                    {upload.description.length > MAX_LENGTH
                      ? (expandedItems[upload._id] ? upload.description : upload.description.substring(0, MAX_LENGTH) + '...')
                      : upload.description}
                  </p>
                  {upload.description.length > MAX_LENGTH && (
                    <button onClick={() => toggleExpand(upload._id)} className="read-more-btn">
                      {expandedItems[upload._id] ? 'Read Less' : 'Read More'}
                    </button>
                  )}
                </div>

                {upload.image && (
                  <div className="allpost-image-wrap">
                    <img
                      src={`/uploads/${upload.image}`}
                      alt={upload.description}
                      className="allpost-image"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                <div className="allpost-actions">
                  <button 
                    className={`action-btn ${hasLiked ? 'liked' : ''}`} 
                    onClick={() => handleLike(upload._id)}
                  >
                    {hasLiked ? '❤️' : '🤍'} {likesCount}
                  </button>
                  <button 
                    className="action-btn" 
                    onClick={() => toggleComments(upload._id)}
                  >
                    💬 {commentsCount}
                  </button>
                  <button className="action-btn">🔗 Share</button>
                </div>

                {showComments[upload._id] && (
                  <div className="comments-section">
                    <div className="comments-list">
                      {upload.comments && upload.comments.length > 0 ? (
                        upload.comments.map((comment, idx) => (
                          <div key={idx} className="comment-item">
                            <Link to={`/getprofile/${comment.rollNo}`} className="comment-author">
                              {comment.author}
                            </Link>
                            <span className="comment-time">{moment(comment.createdAt).fromNow()}</span>
                            <p className="comment-text">{comment.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="no-comments">No comments yet. Be the first!</p>
                      )}
                    </div>
                    
                    <div className="comment-input-area">
                      <input 
                        type="text" 
                        placeholder="Write a comment..." 
                        value={commentText[upload._id] || ''}
                        onChange={(e) => setCommentText({...commentText, [upload._id]: e.target.value})}
                        onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(upload._id)}
                      />
                      <button onClick={() => handleCommentSubmit(upload._id)}>Post</button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Allpost;
