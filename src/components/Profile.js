// Profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from './MessagePopup'; 
import "./Myprofile.css"; // Reuse the premium styling
import { useParams, useNavigate } from "react-router-dom";
import { 
  Mail, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  MessageSquare, 
  Heart, 
  Share2,
  ChevronLeft,
  Calendar
} from 'lucide-react';
import moment from 'moment';

const Profile = () => {
  const [profiledata, setProfile] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const { rollNo } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.post("/api/getotherprofile", { rollNo });
        if (response.data.uploads) {
          setProfile(response.data.uploads);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfile();
  }, [rollNo]);

  if (!profiledata) {
    return (
      <div className="loading-screen">
        <div className="premium-spinner"></div>
        <p>Fetching profile...</p>
      </div>
    );
  }

  const imageSrc = profiledata.image 
    ? `/uploads/${profiledata.image}`
    : null;

  return (
    <div className="profile-page-root">
      {/* ── HEADER NAVIGATION ── */}
      <div className="profile-top-nav">
        <button className="back-circle-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </button>
        <div className="nav-profile-summary">
          <span className="nav-name">{profiledata.name}</span>
          <span className="nav-status">Online</span>
        </div>
      </div>

      <div className="profile-scroll-container">
        {/* ── HERO SECTION ── */}
        <section className="profile-hero-section">
          <div className="profile-cover-gradient"></div>
          
          <div className="profile-main-card">
            <div className="profile-avatar-wrap">
              {imageSrc ? (
                <img src={imageSrc} alt={profiledata.name} className="main-avatar-img" />
              ) : (
                <div className="avatar-placeholder-large">{profiledata.name?.charAt(0)}</div>
              )}
            </div>

            <div className="profile-identity">
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <h1 className="display-name">{profiledata.name}</h1>
                <span className={`mp-role-badge ${profiledata.role}`} style={{padding: '2px 10px', fontSize: '0.7rem'}}>
                  {profiledata.role === 'alumni' ? '🎓 Alumni' : profiledata.role === 'admin' ? '🛡️ Admin' : '📚 Student'}
                </span>
              </div>
              <p className="professional-tagline">
                {profiledata.jobTitle ? `${profiledata.jobTitle} @ ${profiledata.company}` : `${profiledata.branch} Student`}
              </p>
              
              <div className="profile-badges-row">
                <span className="profile-badge-pill"><GraduationCap size={14} /> Class of {profiledata.year}</span>
                <span className="profile-badge-pill"><BookOpen size={14} /> {profiledata.branch}</span>
              </div>
            </div>

            <div className="profile-actions-hub">
              <button className="primary-action-btn" onClick={() => setPopupOpen(true)}>
                <MessageSquare size={18} /> Send Message
              </button>
              <button className="secondary-action-btn">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* ── CONTENT GRID ── */}
        <div className="profile-content-grid">
          
          {/* LEFT: About & Details */}
          <aside className="profile-details-column">
            <div className="details-card">
              <h3>Contact & Information</h3>
              <div className="detail-item">
                <Mail className="detail-icon" />
                <div className="detail-text">
                  <label>Email Address</label>
                  <p>{profiledata.email}</p>
                </div>
              </div>
              <div className="detail-item">
                <Briefcase className="detail-icon" />
                <div className="detail-text">
                  <label>Roll Number</label>
                  <p>#{profiledata.rollNo}</p>
                </div>
              </div>
              <div className="detail-item">
                <Calendar className="detail-icon" />
                <div className="detail-text">
                  <label>Member Since</label>
                  <p>January 2024</p>
                </div>
              </div>
            </div>

            <div className="stats-mini-card">
              <div className="stat-box">
                <strong>{profiledata.posts?.length || 0}</strong>
                <span>Posts</span>
              </div>
              <div className="stat-box">
                <strong>{profiledata.friends?.length || 0}</strong>
                <span>Friends</span>
              </div>
            </div>
          </aside>

          {/* RIGHT: Timeline / Posts */}
          <main className="profile-timeline-column">
            <div className="timeline-header">
              <h3>Recent Activities</h3>
            </div>

            <div className="timeline-posts-list">
              {(!profiledata.posts || profiledata.posts.length === 0) ? (
                <div className="empty-timeline-state">
                  <div className="empty-icon">📂</div>
                  <p>{profiledata.name} hasn't shared any posts yet.</p>
                </div>
              ) : (
                profiledata.posts.map((post) => (
                  <div key={post._id} className="timeline-post-card">
                    <div className="post-header">
                      <img src={imageSrc} className="post-tiny-avatar" alt="" />
                      <div className="post-header-info">
                        <strong>{profiledata.name}</strong>
                        <span>{moment(post.createdAt).fromNow()}</span>
                      </div>
                    </div>
                    
                    <p className="post-content-text">{post.description}</p>
                    
                    {post.image && (
                      <div className="post-media-wrap">
                        <img 
                          src={`/uploads/${post.image}`} 
                          alt="Post Content" 
                          className="post-media-img" 
                        />
                      </div>
                    )}

                    <div className="post-engagement">
                      <button className="engage-btn"><Heart size={16} /> <span>{post.likes?.length || 0}</span></button>
                      <button className="engage-btn"><MessageSquare size={16} /> <span>{post.comments?.length || 0}</span></button>
                      <button className="engage-btn"><Share2 size={16} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>

        </div>
      </div>

      <Popup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)} targetName={profiledata.name} targetRollNo={profiledata.rollNo} />
    </div>
  );
};

export default Profile;
