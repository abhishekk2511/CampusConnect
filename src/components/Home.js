import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

const features = [
  {
    icon: "🤝",
    title: "Alumni Mentorship",
    desc: "Connect one-on-one with alumni who've walked your path. Get career advice, industry insights, and real guidance from experienced professionals.",
  },
  {
    icon: "💼",
    title: "Job & Internship Board",
    desc: "Exclusive opportunities posted by alumni for students. From startups to MNCs — find roles that match your skills and aspirations.",
  },
  {
    icon: "🌐",
    title: "Alumni Directory",
    desc: "Browse a rich directory of graduates by batch, branch, or company. Reconnect with batchmates or discover new contacts in your field.",
  },
  {
    icon: "📅",
    title: "Campus Events",
    desc: "Stay updated with reunions, webinars, workshops, and talks organised by the college community — never miss what matters.",
  },
  {
    icon: "📖",
    title: "Success Stories",
    desc: "Read inspiring journeys of alumni who started just like you. Let their experiences motivate and guide your own story.",
  },
  {
    icon: "🔔",
    title: "Smart Notifications",
    desc: "Get personalised alerts for new mentors, job postings, and events relevant to your branch and interests.",
  },
];

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // Already logged in → skip home page
    }
  }, []);

  return (
    <div className="home-container">

      {/* ── Navbar ── */}
      <div className="navbar">
        <div className="navbar-left">
          <h2>Campus<span>Connect</span></h2>
        </div>
        <div className="navbar-right">
          <Link to="/signup" className="nav-link">Register</Link>
          <Link to="/signin" className="nav-link">Sign In</Link>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <div className="college-info">

        {/* Left: Text */}
        <div className="college-text">
          <span className="eyebrow">The GGSIPU Student Hub</span>

          <h1>
            Empowering IPU<br />
            <em>Student Bonds.</em>
          </h1>

          <div className="rule"></div>

          <p>
            The premier social and professional bridge for Guru Gobind Singh Indraprastha 
            University students. Beyond just networking, we focus on building deep, 
            meaningful connections between peers, batchmates, and seniors across all 
            120+ affiliated IPU colleges.
          </p>
          <p>
            Whether you're looking for mentorship from a final-year senior, 
            collaborating on projects with batchmates, or networking with successful 
            alumni, CampusConnect is where the GGSIPU community comes together to 
            grow, share, and lead.
          </p>

          <div className="cta-row">
            <Link to="/signup" className="cta-btn primary">Join the Network</Link>
            <Link to="/signin" className="cta-btn secondary">Sign In</Link>
          </div>

          <div className="stats-strip">
            <div className="stat-item">
              <div className="num">500+</div>
              <div className="label">Alumni</div>
            </div>
            <div className="stat-item">
              <div className="num">1.2k</div>
              <div className="label">Students</div>
            </div>
            <div className="stat-item">
              <div className="num">300+</div>
              <div className="label">Mentors</div>
            </div>
          </div>
        </div>

        {/* Right: GGSIPU Campus Slideshow */}
        <div className="hero-slideshow-wrap">
          <div className="slideshow-container">
            <div className="slide" style={{ backgroundImage: 'url("/campus/campus1.png")' }}></div>
            <div className="slide" style={{ backgroundImage: 'url("/campus/campus3.png")' }}></div>
            
            <div className="slideshow-overlay">
              <div className="hero-video-badge">
                <span className="badge-icon">🏛️</span>
                <div>
                  <p className="badge-title">Guru Gobind Singh</p>
                  <p className="badge-sub">Indraprastha University · Dwarka, Delhi</p>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="slideshow-glow" />
            <div className="slideshow-border" />
          </div>
        </div>

      </div>

      {/* ── Features Grid ── */}
      <section className="features-section">
        <div className="features-header">
          <span className="eyebrow">What We Offer</span>
          <h2>Everything you need to <em>grow together</em></h2>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <h3>Campus<span>Connect</span></h3>
            <p>
              Building bridges between students and alumni —<br />
              one meaningful connection at a time.
            </p>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Platform</h4>
              <Link to="/signup">Register</Link>
              <Link to="/signin">Sign In</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
            <div className="footer-col">
              <h4>Community</h4>
              <a href="#">Alumni Directory</a>
              <a href="#">Mentorship</a>
              <a href="#">Events</a>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <a href="#">FAQ</a>
              <a href="#">Contact Us</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CampusConnect. All rights reserved.</p>
          <p>Made with ❤️ for the college community</p>
        </div>
      </footer>

    </div>
  );
}

export default Home;