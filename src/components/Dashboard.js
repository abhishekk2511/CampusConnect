import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Allpost from "./Allpost";
import Setprofile from "./Setprofile";
import Messages from "./Messages";
import ResumeAnalyzer from "./ResumeAnalyzer";
import JobBoard from "./JobBoard";
import AlumniMap from "./AlumniMap";
import ReferralDashboard from "./ReferralDashboard";
import SuccessStories from "./SuccessStories";
import AlumniBadges from "./AlumniBadges";
import LiveMentoring from "./LiveMentoring";
import FriendSystem from "./FriendSystem";
import Chatbot from "./Chatbot";
import axios from "axios";
import "./Dashboard.css";

/* ─────────────────────────────────────────
   MOCK FEED DATA — GGSIPU Students & Alumni
───────────────────────────────────────── */
const MOCK_POSTS = [
  {
    id: 1,
    author: "Ananya Sharma",
    role: "student",
    branch: "CSE — 3rd Year · GGSIPU",
    avatar: "A",
    avatarColor: "#c9a84c",
    time: "2 hours ago",
    tag: "Study Resource",
    tagColor: "#2563eb",
    text: "Finally cracked Dynamic Programming after 2 weeks of struggle 😤🔥 Started with basic recursion → memoization → tabulation. If anyone needs notes for DAA exam, DM me. Also sharing my roadmap below 👇",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=75",
    imageAlt: "Programming notes on whiteboard",
    likes: 84,
    comments: 23,
    liked: false,
  },
  {
    id: 2,
    author: "Rohan Verma",
    role: "alumni",
    branch: "ECE Batch '21 · Now at Infosys",
    avatar: "R",
    avatarColor: "#16a34a",
    time: "5 hours ago",
    tag: "Placement Tip",
    tagColor: "#16a34a",
    text: "Got placed at Infosys during campus drive last semester. Here's what nobody tells you — DSA matters more than your CGPA for tech roles. I practiced 150+ LeetCode questions in 3 months.\n\nFor GGSIPU students: Aptitude rounds are easy if you clear RS Aggarwal. Start early, don't panic. Happy to do 1:1 mock interviews — comment below! 🙌",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=75",
    imageAlt: "Developer at laptop coding",
    likes: 201,
    comments: 47,
    liked: false,
  },
  {
    id: 3,
    author: "Priya Kapoor",
    role: "student",
    branch: "IT — 2nd Year · GGSIPU",
    avatar: "P",
    avatarColor: "#9333ea",
    time: "Yesterday",
    tag: "Project Showcase",
    tagColor: "#9333ea",
    text: "Our team just built a mini library management system in Java for the DBMS lab project 📚 Used JDBC + MySQL. Took 3 sleepless nights but it works perfectly!\n\nShoutout to my teammates Karan and Sneha. Open source link in bio 🔗",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=75",
    imageAlt: "Code on monitor screen",
    likes: 56,
    comments: 18,
    liked: false,
  },
  {
    id: 4,
    author: "Vikram Malhotra",
    role: "alumni",
    branch: "CSE Batch '19 · SDE at Microsoft",
    avatar: "V",
    avatarColor: "#0284c7",
    time: "2 days ago",
    tag: "Career Advice",
    tagColor: "#0284c7",
    text: "Juniors at GGSIPU — stop waiting for the perfect moment. Build projects NOW, even bad ones. My first project was a calculator app in Android Studio. Looks embarrassing today but it got me my first interview call.\n\nResumed mentoring sessions every Saturday 10 AM. Register via the Mentorship tab 🗓️",
    image: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=600&q=75",
    imageAlt: "Professional mentoring session",
    likes: 312,
    comments: 89,
    liked: false,
  },
  {
    id: 5,
    author: "Sneha Gupta",
    role: "student",
    branch: "CSE — 4th Year · GGSIPU",
    avatar: "S",
    avatarColor: "#e11d48",
    time: "3 days ago",
    tag: "Exam Prep",
    tagColor: "#dc2626",
    text: "End semester in 2 weeks and I'm sharing my full notes for:\n📌 Operating Systems\n📌 Computer Networks\n📌 Software Engineering\n\nAll based on GGSIPU syllabus. Google Drive link in comments. Best of luck everyone! 🍀 #GGSIPUExams",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=75",
    imageAlt: "Student studying with notes",
    likes: 145,
    comments: 61,
    liked: false,
  },
];

/* ─── Post Card Component ─── */
const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="post-card">
      {/* Author row */}
      <div className="post-header">
        <div className="post-avatar" style={{ background: post.avatarColor }}>
          {post.avatar}
        </div>
        <div className="post-author-info">
          <div className="post-author-row">
            <span className="post-author-name">{post.author}</span>
            <span className={`post-role-badge ${post.role}`}>
              {post.role === "alumni" ? "🎓 Alumni" : "📚 Student"}
            </span>
          </div>
          <span className="post-branch">{post.branch}</span>
        </div>
        <span className="post-time">{post.time}</span>
      </div>

      {/* Tag */}
      <span className="post-tag" style={{ color: post.tagColor, borderColor: post.tagColor + "33", background: post.tagColor + "10" }}>
        {post.tag}
      </span>

      {/* Text */}
      <p className="post-text">{post.text}</p>

      {/* Image */}
      {post.image && (
        <div className="post-img-wrap">
          <img src={post.image} alt={post.imageAlt} className="post-img" />
        </div>
      )}

      {/* Actions */}
      <div className="post-actions">
        <button
          className={`post-action-btn ${liked ? "liked" : ""}`}
          onClick={toggleLike}
        >
          {liked ? "❤️" : "🤍"} {likeCount}
        </button>
        <button className="post-action-btn">
          💬 {post.comments}
        </button>
        <button className="post-action-btn">
          🔗 Share
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN DASHBOARD COMPONENT
───────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("token");
  const [token] = useState(storedToken || "");
  const [profileData, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feed");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null); // ← New state
  const [notifications, setNotifications] = useState([]); // ← Real notifications
  const [unreadCount, setUnreadCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [connectingTo, setConnectingTo] = useState(null); // tracks which button is loading
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }

    // First, try to load profile from localStorage (fast)
    const infoStore = localStorage.getItem("Info");
    if (infoStore) {
      try {
        const parsed = JSON.parse(infoStore);
        if (parsed && parsed.name) {
          setProfile(parsed);
          setLoading(false);
          return;
        }
      } catch (e) {}
    }

    // Otherwise, fetch from backend
    const fetchProfile = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/getprofile",
          { token }
        );
        if (response.data && response.data.uploads) {
          const data = response.data.uploads;
          const obj = {
            name: data.name,
            rollNo: String(data.rollNo),
            branch: data.branch,
            email: data.email,
            image: data.image, // ← Added image
          };
          localStorage.setItem("Info", JSON.stringify(obj));
          setProfile(obj);
        } else {
          // No profile set yet — will trigger profile setup screen
          setProfile(null);
        }
      } catch (error) {
        console.log("Profile fetch error:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  // ── Fetch Notifications ──
  const fetchNotifications = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/notifications/get", { token });
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (e) {
      console.log("Notif fetch error");
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
      fetchSuggestions();
      loadSentRequests();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/people/suggestions", { token });
      setSuggestions(res.data);
    } catch (e) {
      console.log("Suggestions fetch error", e);
    }
  };

  // Pre-load already-sent request IDs from profile data
  const loadSentRequests = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/getprofile", { token });
      const sentIds = (res.data?.uploads?.sentRequests || []).map(id => String(id));
      if (sentIds.length) setSentRequests(prev => [...new Set([...prev, ...sentIds])]);
    } catch (e) {
      // Silent — not critical
    }
  };

  const handleSendRequest = async (rollNo) => {
    if (sentRequests.includes(rollNo) || connectingTo === rollNo) return;
    setConnectingTo(rollNo);
    try {
      await axios.post("http://localhost:5000/api/friends/request", { token, targetRollNo: rollNo });
      setSentRequests(prev => [...prev, rollNo]);
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to send request";
      alert(msg);
    } finally {
      setConnectingTo(null);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 1) {
      try {
        const res = await axios.post("http://localhost:5000/api/people/search", { query });
        setSearchResults(res.data);
        setShowSearch(true);
      } catch (e) {
        console.log("Search error");
      }
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.post("http://localhost:5000/api/notifications/mark-all-read", { token });
      fetchNotifications();
    } catch (e) {}
  };

  const handleNotifClick = async (notif) => {
    try {
      if (!notif.read) {
        await axios.post("http://localhost:5000/api/notifications/mark-read", { token, notificationId: notif._id });
      }
      setShowNotifications(false);
      if (notif.link) setActiveTab(notif.link);
      fetchNotifications();
    } catch (e) {}
  };

  const uploadHandler = () => navigate("/upload");
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Info"); // ← Clear this user's profile
    navigate("/signin");
  };
  const home = () => navigate("/");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="db-loading">
        <div className="db-loading-inner">
          <div className="db-spinner"></div>
          <p>Loading your campus feed…</p>
        </div>
      </div>
    );
  }

  /* ── No profile → Setprofile ── */
 if (!profileData || !profileData.name) {
    return (
      <div className="db-setup-wrap">
        <div className="db-setup-header">
          <Link to="/" className="db-logo">Campus<span>Connect</span></Link>
        </div>
        <Setprofile token={storedToken} />
      </div>
    );
  }

  /* ── Filter posts by tab ── */
  const visiblePosts =
    activeTab === "alumni"
      ? MOCK_POSTS.filter((p) => p.role === "alumni")
      : activeTab === "students"
      ? MOCK_POSTS.filter((p) => p.role === "student")
      : MOCK_POSTS;

  /* ── Main Dashboard ── */
  return (
    <div className="db-root">

      {/* ════ NAVBAR ════ */}
      <header className="db-navbar">
        <Link to="/" className="db-logo">Campus<span>Connect</span></Link>

        <div className="db-search">
          <span className="db-search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search students, alumni..." 
            value={searchQuery}
            onChange={handleSearch}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            onFocus={() => searchQuery.length > 1 && setShowSearch(true)}
          />
          
          {showSearch && searchResults.length > 0 && (
            <div className="db-search-dropdown">
              {searchResults.map(user => (
                <Link to={`/getprofile/${user.rollNo}`} key={user.rollNo} className="db-search-item">
                  <div className="si-avatar">
                    {user.image ? <img src={`http://localhost:5000/uploads/${user.image}`} alt="" /> : user.name.charAt(0)}
                  </div>
                  <div className="si-info">
                    <p className="si-name">{user.name}</p>
                    <p className="si-meta">{user.branch} · {user.rollNo}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="db-nav-actions">
          <button className="db-nav-icon-btn" onClick={uploadHandler} title="Upload Post">
            <span>＋</span>
          </button>
          <button 
            className="db-nav-icon-btn" 
            onClick={() => setActiveTab("messages")}
            title="Messages"
          >
            💬
          </button>
          <div style={{ position: "relative" }}>
            <button 
              className="db-nav-icon-btn" 
              onClick={() => setShowNotifications(!showNotifications)} 
              title="Notifications"
              style={{ position: 'relative' }}
            >
              🔔
              {unreadCount > 0 && <span className="db-notif-badge">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="db-notif-dropdown">
                <div className="notif-header">
                  <h4>Notifications ({unreadCount})</h4>
                  <button className="mark-all-btn" onClick={markAllRead}>Clear All</button>
                </div>
                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <p className="notif-empty">No new alerts</p>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif._id} 
                        className={`notif-item ${!notif.read ? 'unread' : ''}`}
                        onClick={() => handleNotifClick(notif)}
                      >
                        <div className="notif-avatar">
                          {notif.sender?.image ? (
                            <img src={`http://localhost:5000/uploads/${notif.sender.image}`} alt="" />
                          ) : (
                            <span>{notif.sender?.name?.charAt(0)}</span>
                          )}
                        </div>
                        <div className="notif-body">
                           <p>{notif.content}</p>
                           <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="db-nav-avatar" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {profileData.image ? (
              <img src={`http://localhost:5000/uploads/${profileData.image}`} alt="Avatar" className="avatar-img" />
            ) : (
              profileData.name?.charAt(0).toUpperCase()
            )}
          </div>
        </div>
      </header>

      <div className="db-body">

        {/* ════ LEFT SIDEBAR ════ */}
        <aside className={`db-sidebar ${sidebarOpen ? "open" : ""}`}>

          <div className="db-profile-card">
            <div className="db-avatar-large">
              {profileData.image ? (
                <img src={`http://localhost:5000/uploads/${profileData.image}`} alt="Avatar" className="avatar-img-large" />
              ) : (
                profileData.name?.charAt(0).toUpperCase()
              )}
            </div>
            <h3 className="db-profile-name">{profileData.name}</h3>
            <p className="db-profile-meta">{profileData.branch}</p>
            {profileData.jobTitle && (
              <p className="db-profile-job">{profileData.jobTitle} @ {profileData.company}</p>
            )}
            <p className="db-profile-roll">#{profileData.rollNo}</p>
            <Link to="/myprofile" className="db-view-profile-btn">View Full Profile</Link>
          </div>

          <nav className="db-sidenav">
            <button
              className={`db-sidenav-item ${activeTab === "feed" ? "active" : ""}`}
              onClick={() => { setActiveTab("feed"); setSidebarOpen(false); }}
            >
              <span className="nav-icon">🏠</span><span>Campus Feed</span>
            </button>
            <button
              className={`db-sidenav-item ${activeTab === "network" ? "active" : ""}`}
              onClick={() => { setActiveTab("network"); setSidebarOpen(false); }}
            >
              <span className="nav-icon">🤝</span><span>Networking Hub</span>
            </button>
            <button
              className={`db-sidenav-item ${activeTab === "messages" ? "active" : ""}`}
              onClick={() => { setActiveTab("messages"); setSidebarOpen(false); }}
            >
              <span className="nav-icon">💬</span><span>Messages</span>
            </button>
            <Link to="/myprofile" className="db-sidenav-item">
              <span className="nav-icon">👤</span><span>My Profile</span>
            </Link>
            <button
              className={`db-sidenav-item ${activeTab === "resume" ? "active" : ""}`}
              onClick={() => { setActiveTab("resume"); setSidebarOpen(false); }}
            >
              <span className="nav-icon">📄</span><span>Resume Analyzer</span>
            </button>
            <button
              className={`db-sidenav-item ${activeTab === "jobs" ? "active" : ""}`}
              onClick={() => { setActiveTab("jobs"); setSidebarOpen(false); }}
            >
              <span className="nav-icon">💼</span><span>Job Board</span>
            </button>
            <button
              className={`db-sidenav-item ${activeTab === "map" ? "active" : ""}`}
              onClick={() => { setActiveTab("map"); setSidebarOpen(false); }}
            >
              <span className="nav-icon">🌍</span><span>Global Map</span>
            </button>
            <button
              className={`db-sidenav-item ${activeTab === "referrals" ? "active" : ""}`}
              onClick={() => { setActiveTab("referrals"); setSidebarOpen(false); }}
            >
              <span className="nav-icon">🤝</span><span>Referrals</span>
            </button>
            <button
              className={`db-sidenav-item ${activeTab === "stories" ? "active" : ""}`}
              onClick={() => { setActiveTab("stories"); setSidebarOpen(false); }}
            >
              <span className="nav-icon">📖</span><span>Success Stories</span>
            </button>
            <button
              className={`db-sidenav-item ${activeTab === "badges" ? "active" : ""}`}
              onClick={() => { setActiveTab("badges"); setSidebarOpen(false); }}
            >
              <span className="nav-icon">🏆</span><span>Leaderboard</span>
            </button>
            <button
              className={`db-sidenav-item ${activeTab === "mentoring" ? "active" : ""}`}
              onClick={() => { setActiveTab("mentoring"); setSidebarOpen(false); }}
            >
              <span className="nav-icon">🎙️</span><span>Live Mentoring</span>
            </button>
            <button className="db-sidenav-item" onClick={uploadHandler}>
              <span className="nav-icon">📤</span><span>Upload Post</span>
            </button>
            <button className="db-sidenav-item" onClick={home}>
              <span className="nav-icon">🌐</span><span>Home Page</span>
            </button>
          </nav>

          <div className="db-sidebar-stats">
            <div className="db-stat">
              <span className="db-stat-num">500+</span>
              <span className="db-stat-label">Alumni</span>
            </div>
            <div className="db-stat">
              <span className="db-stat-num">1.2k</span>
              <span className="db-stat-label">Students</span>
            </div>
          </div>

          <button className="db-logout-btn" onClick={logout}>🚪 Logout</button>

        </aside>

        {/* ════ MAIN CONTENT ════ */}
        {activeTab === "messages" ? (
          <Messages selectedFriend={selectedFriend} />
        ) : activeTab === "resume" ? (
          <ResumeAnalyzer />
        ) : activeTab === "jobs" ? (
          <JobBoard />
        ) : activeTab === "network" ? (
          <FriendSystem setActiveTab={setActiveTab} setSelectedFriend={setSelectedFriend} />
        ) : activeTab === "map" ? (
          <AlumniMap />
        ) : activeTab === "referrals" ? (
          <ReferralDashboard />
        ) : activeTab === "stories" ? (
          <SuccessStories />
        ) : activeTab === "badges" ? (
          <AlumniBadges />
        ) : activeTab === "mentoring" ? (
          <LiveMentoring />
        ) : (
          <main className="db-main">

            {/* Tabs bar */}
            <div className="db-feed-header">
              <div className="db-feed-tabs">
                <button className={`db-tab ${activeTab === "feed" ? "active" : ""}`} onClick={() => setActiveTab("feed")}>🏠 All Posts</button>
                <button className={`db-tab ${activeTab === "alumni" ? "active" : ""}`} onClick={() => setActiveTab("alumni")}>🎓 Alumni</button>
                <button className={`db-tab ${activeTab === "students" ? "active" : ""}`} onClick={() => setActiveTab("students")}>📚 Students</button>
              </div>
              <button className="db-quick-upload" onClick={uploadHandler}>＋ New Post</button>
            </div>

            {/* Welcome banner */}
            {activeTab === "feed" && (
              <div className="db-welcome-banner">
                <div className="db-welcome-text">
                  <span className="db-welcome-eyebrow">Welcome back · GGSIPU</span>
                  <h2>{profileData.name?.split(" ")[0]} 👋</h2>
                  <p>See what's happening across your campus network today.</p>
                </div>
                <div className="db-welcome-art">🎓</div>
              </div>
            )}

            {/* Real posts from backend — rendered FIRST so new uploads appear at top */}
            <div className="db-posts-wrap db-real-posts">
              <p className="db-section-divider">— Your latest posts from the network —</p>
              <Allpost />
            </div>

            {/* Community sample posts below */}
            <div className="db-posts-feed">
              <p className="db-section-divider">— Community highlights —</p>
              {visiblePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

          </main>
        )}

        {/* ════ RIGHT PANEL ════ */}
        {(activeTab !== "messages" && activeTab !== "resume" && activeTab !== "jobs" && activeTab !== "map" && activeTab !== "referrals" && activeTab !== "stories" && activeTab !== "badges" && activeTab !== "mentoring") && (
          <aside className="db-right-panel">

            <div className="db-widget">
              <h4 className="db-widget-title">Quick Actions</h4>
              <button className="db-action-btn" onClick={uploadHandler}>📤 <span>Upload a Post</span></button>
              <button className="db-action-btn" onClick={() => setActiveTab("messages")}>💬 <span>Messages</span></button>
              <Link to="/myprofile" className="db-action-btn">👤 <span>Edit Profile</span></Link>
              <button className="db-action-btn" onClick={toggleTheme}>
                {theme === 'light' ? '🌙' : '☀️'} <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
              <button className="db-action-btn" onClick={home}>🌐 <span>Visit Home Page</span></button>
            </div>

            {/* Real Suggestions Widget */}
            <div className="db-widget">
              <h4 className="db-widget-title">🤝 People You May Know</h4>
              {suggestions.length === 0 ? (
                <p className="db-empty-msg">No suggestions yet</p>
              ) : (
                suggestions.map((user) => (
                  <div key={user.rollNo} className="db-mentor-row">
                    <Link to={`/getprofile/${user.rollNo}`} className="db-mentor-clickable">
                      <div className="db-mentor-avatar">
                        {user.image ? (
                          <img src={`http://localhost:5000/uploads/${user.image}`} alt="" className="avatar-img-small" />
                        ) : (
                          user.name?.charAt(0)
                        )}
                      </div>
                      <div className="db-mentor-info">
                        <p className="db-mentor-name">{user.name}</p>
                        <p className="db-mentor-co">{user.branch} {user.jobTitle ? `· ${user.jobTitle}` : ""}</p>
                      </div>
                    </Link>
                    <button 
                      className={`db-connect-btn ${sentRequests.includes(user.rollNo) ? 'sent' : ''} ${connectingTo === user.rollNo ? 'connecting' : ''}`}
                      onClick={() => handleSendRequest(user.rollNo)}
                      disabled={sentRequests.includes(user.rollNo) || connectingTo === user.rollNo}
                    >
                      {connectingTo === user.rollNo ? '...' : sentRequests.includes(user.rollNo) ? 'Sent ✓' : '+ Connect'}
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="db-widget db-campus-card">
              <span className="db-campus-badge">🏛️ GGSIPU · CampusConnect</span>
              <h4>Your Campus Network</h4>
              <p>Stay connected with alumni and students. Share opportunities, milestones, and insights.</p>
              <div className="db-campus-stats">
                <div><strong>500+</strong><span>Alumni</span></div>
                <div><strong>300+</strong><span>Mentors</span></div>
                <div><strong>1.2k</strong><span>Students</span></div>
              </div>
            </div>

          </aside>
        )}

      </div>

      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* ════ FLOATING CHATBOT ════ */}
      <Chatbot />

    </div>
  );
};

export default Dashboard;