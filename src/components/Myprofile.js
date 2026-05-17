import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import './Myprofile.css';
import moment from 'moment';

export const Myprofile = () => {
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'about'
    const [profile, setProfile] = useState({
        name: '', email: '', rollNo: '', year: '', branch: '', image: '', company: '', jobTitle: '', role: ''
    });
    const [posts, setPosts] = useState([]);
    const [editForm, setEditForm] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => { if (token) fetchProfile(); }, [token]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/getprofile', { token });
            const data = response.data.uploads || null;
            if (data) {
                const profileObj = {
                    name: data.name || 'GGSIPU Member',
                    email: data.email || '',
                    rollNo: String(data.rollNo || ''),
                    year: data.year || '',
                    branch: data.branch || '',
                    image: data.image || '',
                    company: data.company || '',
                    jobTitle: data.jobTitle || '',
                    friends: data.friends || [],
                    isVerified: data.isVerified || false,
                    verificationStatus: data.verificationStatus || 'none',
                    role: data.role || 'student'
                };
                setProfile(profileObj);
                setEditForm(profileObj);
                setPosts(data.posts || []);
            } else {
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const decoded = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
                    if (decoded.rollNo) {
                        setProfile(prev => ({ ...prev, rollNo: decoded.rollNo }));
                        const postsRes = await axios.post('/api/myuploads', { rollNo: decoded.rollNo });
                        setPosts(postsRes.data || []);
                    }
                } catch (e) {}
            }
        } catch (error) {
            console.error('Error fetching profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = e => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = e => {
        const file = e.target.files[0];
        if (file) {
            setEditForm(prev => ({ ...prev, newImage: file }));
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async e => {
        e.preventDefault();
        try {
            setSaving(true);
            const formData = new FormData();
            formData.append('token', token);
            formData.append('name', editForm.name);
            formData.append('year', editForm.year);
            formData.append('branch', editForm.branch);
            formData.append('company', editForm.company);
            formData.append('jobTitle', editForm.jobTitle);
            if (editForm.newImage) formData.append('setimage', editForm.newImage);

            const res = await axios.post('/api/editprofile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setIsEditing(false);
                setImagePreview(null);
                fetchProfile();
            }
        } catch {
            alert('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleVerificationUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setSaving(true);
            const formData = new FormData();
            formData.append('token', token);
            formData.append('doc', file);

            const res = await axios.post('/api/verify/request', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (res.data.success) {
                alert("Verification request submitted!");
                fetchProfile();
            }
        } catch (error) {
            alert("Failed to upload verification document");
        } finally {
            setSaving(false);
        }
    };

    const avatarSrc = imagePreview ||
        (profile.image ? `/uploads/${profile.image}` : null);

    const initials = profile.name ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

    const totalLikes = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);

    if (loading) return (
        <div className="mp-loading">
            <div className="mp-spinner" />
            <p>Loading profile…</p>
        </div>
    );

    return (
        <div className="mp-root">

            {/* ── Cover Banner ── */}
            <div className="mp-cover">
                <div className="mp-cover-gradient" />
                <div className="mp-cover-pattern" />

                {/* Back link */}
                <a href="/dashboard" className="mp-back-btn">← Back to Feed</a>

                {/* Edit toggle */}
                <button className="mp-edit-toggle" onClick={() => { setIsEditing(!isEditing); setImagePreview(null); }}>
                    {isEditing ? '✕ Cancel' : '✏ Edit Profile'}
                </button>
            </div>

            {/* ── Profile Hero ── */}
            <div className="mp-hero">
                {/* Avatar */}
                <div className="mp-avatar-wrap" onClick={() => isEditing && fileInputRef.current?.click()}>
                    {avatarSrc ? (
                        <img src={avatarSrc} alt="avatar" className="mp-avatar-img" />
                    ) : (
                        <div className="mp-avatar-initials">{initials}</div>
                    )}
                    {isEditing && (
                        <div className="mp-avatar-overlay">
                            <span>📷</span>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden accept="image/*" />
                </div>

                {/* Identity */}
                <div className="mp-identity">
                    <div className="mp-name-row">
                        <h1 className="mp-name">{profile.name || 'Your Name'}</h1>
                        <span className={`mp-role-badge ${profile.role}`}>
                            {profile.role === 'alumni' ? '🎓 Alumni' : profile.role === 'admin' ? '🛡️ Admin' : '📚 Student'}
                        </span>
                        {profile.isVerified && <span className="mp-verified" title="Verified Alumni">✓</span>}
                    </div>
                    <p className="mp-headline">
                        {profile.jobTitle
                            ? `${profile.jobTitle}${profile.company ? ` @ ${profile.company}` : ''}`
                            : `${profile.branch || 'Student'} · GGSIPU`}
                    </p>
                    <div className="mp-meta-pills">
                        {profile.rollNo && <span className="mp-pill">#{profile.rollNo}</span>}
                        {profile.year && <span className="mp-pill">📅 Class of {profile.year}</span>}
                        {profile.branch && <span className="mp-pill">🎓 {profile.branch}</span>}
                        <span className="mp-pill">📍 New Delhi, India</span>
                    </div>
                </div>

                {/* Stats row */}
                <div className="mp-stats-row">
                    <div className="mp-stat-box">
                        <strong>{posts.length}</strong>
                        <span>Posts</span>
                    </div>
                    <div className="mp-stat-box">
                        <strong>{profile.friends?.length || 0}</strong>
                        <span>Connections</span>
                    </div>
                    <div className="mp-stat-box">
                        <strong>{totalLikes}</strong>
                        <span>Likes</span>
                    </div>
                </div>
            </div>

            {/* ── Edit Form (slides in) ── */}
            {isEditing && (
                <div className="mp-edit-panel">
                    <h3>Update Profile</h3>
                    <form className="mp-edit-form" onSubmit={handleSave}>
                        <div className="mp-ef-grid">
                            <div className="mp-ef-field">
                                <label>Full Name</label>
                                <input name="name" value={editForm.name} onChange={handleInputChange} required placeholder="Your full name" />
                            </div>
                            <div className="mp-ef-field">
                                <label>Graduation Year</label>
                                <input name="year" value={editForm.year} onChange={handleInputChange} required placeholder="e.g. 2024" />
                            </div>
                            <div className="mp-ef-field">
                                <label>Branch / Department</label>
                                <input name="branch" value={editForm.branch} onChange={handleInputChange} required placeholder="e.g. CSE" />
                            </div>
                            <div className="mp-ef-field">
                                <label>Current Company</label>
                                <input name="company" value={editForm.company} onChange={handleInputChange} placeholder="e.g. Google" />
                            </div>
                            <div className="mp-ef-field mp-ef-full">
                                <label>Job Title</label>
                                <input name="jobTitle" value={editForm.jobTitle} onChange={handleInputChange} placeholder="e.g. Software Engineer" />
                            </div>
                        </div>
                        <button type="submit" className="mp-save-btn" disabled={saving}>
                            {saving ? <><span className="mp-btn-spinner" /> Saving…</> : '💾 Save Changes'}
                        </button>
                    </form>
                </div>
            )}

            {/* ── Tab Bar ── */}
            <div className="mp-tabs">
                <button className={`mp-tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
                    📸 Posts ({posts.length})
                </button>
                <button className={`mp-tab ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>
                    👤 About
                </button>
            </div>

            {/* ── Content ── */}
            <div className="mp-content">

                {activeTab === 'posts' && (
                    <div className="mp-posts-grid">
                        {posts.length === 0 ? (
                            <div className="mp-empty">
                                <span className="mp-empty-icon">📭</span>
                                <h3>No posts yet</h3>
                                <p>Share your first update with the campus network!</p>
                                <a href="/upload" className="mp-upload-link">＋ Upload a Post</a>
                            </div>
                        ) : (
                            posts.map(post => (
                                <div key={post._id} className="mp-post-card">
                                    <div className="mp-pc-header">
                                        <div className="mp-pc-avatar">
                                            {avatarSrc ? <img src={avatarSrc} alt="" /> : initials}
                                        </div>
                                        <div className="mp-pc-meta">
                                            <strong>{profile.name}</strong>
                                            <span>{moment(post.createdAt).fromNow()}</span>
                                        </div>
                                    </div>

                                    {post.description && <p className="mp-pc-text">{post.description}</p>}

                                    {post.image && (
                                        <div className="mp-pc-media">
                                            <img
                                                src={post.image.startsWith('http') ? post.image : `/uploads/${post.image}`}
                                                alt=""
                                            />
                                        </div>
                                    )}

                                    <div className="mp-pc-footer">
                                        <button className="mp-pc-action">❤ {post.likes?.length || 0}</button>
                                        <button className="mp-pc-action">💬 {post.comments?.length || 0}</button>
                                        <button className="mp-pc-action">↗ Share</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="mp-about-grid">
                        <div className="mp-about-card">
                            <h4>Academic Information</h4>
                            <div className="mp-about-rows">
                                <div className="mp-about-row">
                                    <span className="mp-about-icon">🎓</span>
                                    <div><label>Branch</label><p>{profile.branch || '—'}</p></div>
                                </div>
                                <div className="mp-about-row">
                                    <span className="mp-about-icon">📅</span>
                                    <div><label>Graduation Year</label><p>{profile.year || '—'}</p></div>
                                </div>
                                <div className="mp-about-row">
                                    <span className="mp-about-icon">#️⃣</span>
                                    <div><label>Roll Number</label><p>{profile.rollNo || '—'}</p></div>
                                </div>
                                <div className="mp-about-row">
                                    <span className="mp-about-icon">✉️</span>
                                    <div><label>Email</label><p>{profile.email || '—'}</p></div>
                                </div>
                            </div>
                        </div>

                        <div className="mp-about-card">
                            <h4>Professional Info</h4>
                            <div className="mp-about-rows">
                                <div className="mp-about-row">
                                    <span className="mp-about-icon">💼</span>
                                    <div><label>Company</label><p>{profile.company || 'University Student'}</p></div>
                                </div>
                                <div className="mp-about-row">
                                    <span className="mp-about-icon">🏷️</span>
                                    <div><label>Job Title</label><p>{profile.jobTitle || 'Student'}</p></div>
                                </div>
                                <div className="mp-about-row">
                                    <span className="mp-about-icon">📍</span>
                                    <div><label>Location</label><p>New Delhi, India</p></div>
                                </div>
                                <div className="mp-about-row">
                                    <span className="mp-about-icon">🏛️</span>
                                    <div><label>University</label><p>GGSIPU</p></div>
                                </div>
                            </div>
                        </div>

                        <div className="mp-about-card">
                            <h4>Verification Status</h4>
                            <div className="mp-verification-status">
                                {profile.isVerified ? (
                                    <div className="mp-status-verified">
                                        <span className="mp-status-icon">✅</span>
                                        <div>
                                            <strong>Verified Alumni</strong>
                                            <p>Your status as a GGSIPU alumnus has been verified.</p>
                                        </div>
                                    </div>
                                ) : profile.verificationStatus === 'pending' ? (
                                    <div className="mp-status-pending">
                                        <span className="mp-status-icon">⏳</span>
                                        <div>
                                            <strong>Verification Pending</strong>
                                            <p>Our admin team is reviewing your documents.</p>
                                        </div>
                                    </div>
                                ) : profile.verificationStatus === 'rejected' ? (
                                    <div className="mp-status-rejected">
                                        <span className="mp-status-icon">❌</span>
                                        <div>
                                            <strong>Verification Rejected</strong>
                                            <p>Your document was not accepted. Please upload a clear ID or degree.</p>
                                            <label className="mp-verify-upload-btn">
                                                Re-upload Document
                                                <input type="file" onChange={handleVerificationUpload} hidden accept="image/*,.pdf" />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mp-status-none">
                                        <span className="mp-status-icon">🛡️</span>
                                        <div>
                                            <strong>Get Verified</strong>
                                            <p>Upload your college ID or degree to get a verified alumni badge.</p>
                                            <label className="mp-verify-upload-btn">
                                                {saving ? 'Uploading...' : 'Upload Document'}
                                                <input type="file" onChange={handleVerificationUpload} hidden accept="image/*,.pdf" disabled={saving} />
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mp-about-card mp-about-card--full">
                            <h4>Network Activity</h4>
                            <div className="mp-network-stats">
                                <div className="mp-ns-box">
                                    <strong>{posts.length}</strong>
                                    <span>Total Posts</span>
                                </div>
                                <div className="mp-ns-box">
                                    <strong>{totalLikes}</strong>
                                    <span>Total Likes</span>
                                </div>
                                <div className="mp-ns-box">
                                    <strong>{posts.reduce((s, p) => s + (p.comments?.length || 0), 0)}</strong>
                                    <span>Comments</span>
                                </div>
                                <div className="mp-ns-box">
                                    <strong>{profile.friends?.length || 0}</strong>
                                    <span>Connections</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};