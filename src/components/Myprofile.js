import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import './Myprofile.css';
import { 
  Camera, 
  Edit3, 
  Globe, 
  Hash, 
  MapPin, 
  Calendar, 
  Briefcase, 
  CheckCircle2,
  Image as ImageIcon,
  Heart,
  MessageSquare,
  Share2
} from 'lucide-react';
import moment from 'moment';

export const Myprofile = () => {
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        rollNo: '',
        year: '',
        branch: '',
        image: '',
        company: '',
        jobTitle: ''
    });
    const [posts, setPosts] = useState([]);
    const [editForm, setEditForm] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (token) {
            fetchProfile();
        }
    }, [token]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/api/getprofile', { token });
            const data = response.data.uploads || null;
            
            console.log("Profile response:", response.data);

            if (data) {
                const profileObj = {
                    name: data.name || 'Alumni / Student',
                    email: data.email || '',
                    rollNo: String(data.rollNo || ''),
                    year: data.year || '',
                    branch: data.branch || '',
                    image: data.image || '',
                    company: data.company || '',
                    jobTitle: data.jobTitle || '',
                    friends: data.friends || []
                };
                setProfile(profileObj);
                setEditForm(profileObj);

                // Use the posts already provided by getprofile
                setPosts(data.posts || []);
            } else {
                // If no profile record yet, we can try to extract rollNo from token to at least show posts
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    const decoded = JSON.parse(jsonPayload);
                    
                    if (decoded.rollNo) {
                        setProfile(prev => ({ ...prev, rollNo: decoded.rollNo }));
                        const postsRes = await axios.post('http://localhost:5000/api/myuploads', { rollNo: decoded.rollNo });
                        setPosts(postsRes.data || []);
                    }
                } catch (e) {
                    console.log("Token decode error", e);
                }
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching profile", error);
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setEditForm(profile);
            setImagePreview(null);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditForm(prev => ({ ...prev, newImage: file }));
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('token', token);
            formData.append('name', editForm.name);
            formData.append('year', editForm.year);
            formData.append('branch', editForm.branch);
            formData.append('company', editForm.company);
            formData.append('jobTitle', editForm.jobTitle);
            if (editForm.newImage) {
                formData.append('setimage', editForm.newImage);
            }

            const res = await axios.post('http://localhost:5000/api/editprofile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                alert("Profile updated successfully! ✨");
                setIsEditing(false);
                fetchProfile();
            }
        } catch (error) {
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !isEditing) {
        return (
            <div className="profile-loading-screen">
                <div className="premium-loader"></div>
                <p>Curating your experience...</p>
            </div>
        );
    }

    return (
        <div className="profile-root">
            <div className="profile-container-main">
                {/* ── TOP SECTION: Cover & Stats ── */}
                <div className="profile-header-card">
                    <div className="header-cover">
                        <div className="header-overlay"></div>
                        <button className="action-pill-btn" onClick={handleEditToggle}>
                            {isEditing ? 'Cancel' : <><Edit3 size={16} /> Edit Profile</>}
                        </button>
                    </div>

                    <div className="header-main-content">
                        <div className="avatar-section">
                            <div className="avatar-frame">
                                {isEditing ? (
                                    <div className="avatar-edit-trigger" onClick={() => fileInputRef.current.click()}>
                                    <img 
                                        src={profile.image ? `http://localhost:5000/uploads/${profile.image}` : `https://ui-avatars.com/api/?name=${profile.name}&background=random&color=fff`} 
                                        alt="" 
                                    />
                                        <div className="cam-overlay"><Camera size={24} /></div>
                                        <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden accept="image/*" />
                                    </div>
                                ) : (
                                    <img 
                                        src={profile.image ? `http://localhost:5000/uploads/${profile.image}` : `https://ui-avatars.com/api/?name=${profile.name}&background=random&color=fff`} 
                                        alt="" 
                                    />
                                )}
                            </div>
                        </div>

                        {!isEditing ? (
                            <div className="identity-section">
                                <div className="name-row">
                                    <h1>{profile.name}</h1>
                                    <CheckCircle2 size={20} className="verified-icon" />
                                </div>
                                <p className="headline">
                                    {profile.jobTitle ? `${profile.jobTitle} @ ${profile.company}` : `${profile.branch} Student · GGSIPU`}
                                </p>
                                
                                <div className="quick-stats">
                                    <div className="q-stat"><Hash size={14} /> <span>{profile.rollNo || "No Roll No"}</span></div>
                                    <div className="q-stat"><Calendar size={14} /> <span>Class of {profile.year || "2024"}</span></div>
                                    <div className="q-stat"><Globe size={14} /> <span>{profile.branch || "General"}</span></div>
                                </div>
                            </div>
                        ) : (
                            <div className="identity-section editing">
                                <h2>Refining your Identity</h2>
                                <p>Ensure your professional details are up to date.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── BOTTOM SECTION: Details & Timeline ── */}
                <div className="profile-layout-grid">
                    
                    {/* LEFT: Information Panel */}
                    <aside className="profile-info-aside">
                        {!isEditing ? (
                            <div className="info-glass-card">
                                <h3>About Information</h3>
                                <div className="info-list">
                                    <div className="info-item">
                                        <Globe className="i-icon" />
                                        <div className="i-text"><label>Branch</label><p>{profile.branch || "Student"}</p></div>
                                    </div>
                                    <div className="info-item">
                                        <Briefcase className="i-icon" />
                                        <div className="i-text"><label>Organization</label><p>{profile.company || "University Student"}</p></div>
                                    </div>
                                    <div className="info-item">
                                        <MapPin className="i-icon" />
                                        <div className="i-text"><label>Location</label><p>New Delhi, India</p></div>
                                    </div>
                                </div>
                                
                                <div className="total-impact-stats">
                                    <div className="impact-box"><strong>{posts.length}</strong><span>Posts</span></div>
                                    <div className="impact-box"><strong>{profile.friends?.length || 0}</strong><span>Connections</span></div>
                                </div>
                            </div>
                        ) : (
                            <form className="edit-form-card" onSubmit={handleSave}>
                                <div className="f-row">
                                    <div className="f-group"><label>Name</label><input name="name" value={editForm.name} onChange={handleInputChange} required /></div>
                                    <div className="f-group"><label>Year</label><input name="year" value={editForm.year} onChange={handleInputChange} required /></div>
                                </div>
                                <div className="f-row">
                                    <div className="f-group"><label>Branch</label><input name="branch" value={editForm.branch} onChange={handleInputChange} required /></div>
                                    <div className="f-group"><label>Company</label><input name="company" value={editForm.company} onChange={handleInputChange} /></div>
                                </div>
                                <div className="f-group"><label>Job Title</label><input name="jobTitle" value={editForm.jobTitle} onChange={handleInputChange} /></div>
                                <button type="submit" className="save-btn-large" disabled={loading}>{loading ? 'Syncing...' : 'Update Profile'}</button>
                            </form>
                        )}
                    </aside>

                    {/* RIGHT: Timeline Feed */}
                    <main className="profile-timeline-main">
                        <div className="timeline-top-bar">
                            <h3>Activity Timeline</h3>
                            <div className="filter-pill">{posts.length} Total Activities</div>
                        </div>

                        <div className="timeline-scroll">
                            {posts.length === 0 ? (
                                <div className="empty-timeline-card">
                                    <ImageIcon size={48} />
                                    <p>Your timeline is looking a bit quiet. Share your first milestone!</p>
                                </div>
                            ) : (
                                posts.map((post) => (
                                    <div key={post._id} className="timeline-post-entry">
                                        <div className="entry-header">
                                            <div className="entry-author-img">
                                                <img src={profile.image ? `http://localhost:5000/uploads/${profile.image}` : `https://ui-avatars.com/api/?name=${profile.name}&background=random&color=fff`} alt="" />
                                            </div>
                                            <div className="entry-meta">
                                                <strong>{profile.name}</strong>
                                                <span>{moment(post.createdAt).fromNow()}</span>
                                            </div>
                                        </div>

                                        <p className="entry-text">{post.description}</p>
                                        
                                        {post.image && (
                                            <div className="entry-media">
                                                <img src={post.image.startsWith('http') ? post.image : `http://localhost:5000/uploads/${post.image}`} alt="" />
                                            </div>
                                        )}

                                        <div className="entry-actions">
                                            <button className="e-act"><Heart size={16} /> <span>{post.likes?.length || 0}</span></button>
                                            <button className="e-act"><MessageSquare size={16} /> <span>{post.comments?.length || 0}</span></button>
                                            <button className="e-act"><Share2 size={16} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
};