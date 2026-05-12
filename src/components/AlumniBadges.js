import React from 'react';
import './AlumniBadges.css';

const MOCK_LEADERS = [
  { rank: 2, name: "Sneha Patel", company: "Stripe", points: 8450, avatarColor: "#e11d48", badges: ["🌟", "💼"] },
  { rank: 1, name: "Vikram Malhotra", company: "Google", points: 12400, avatarColor: "#0284c7", badges: ["🌟", "💼", "🤝", "🔥"] },
  { rank: 3, name: "Rohan Desai", company: "Y Combinator", points: 7200, avatarColor: "#16a34a", badges: ["🌟", "🔥"] },
];

const RECENT_ACHIEVEMENTS = [
  { id: 1, name: "Priya Kapoor", badge: "💼 Top Job Poster", desc: "Posted 5+ high-quality job opportunities this month.", date: "2 hours ago" },
  { id: 2, name: "Rahul Singh", badge: "🤝 Referral Guru", desc: "Successfully referred 10 students to Atlassian.", date: "5 hours ago" },
  { id: 3, name: "Neha Joshi", badge: "🌟 Community Pillar", desc: "Answered over 50 questions in the student forum.", date: "1 day ago" },
];

const ALL_BADGES = [
  { icon: "🌟", name: "Community Pillar", desc: "Consistently highly active on the platform." },
  { icon: "💼", name: "Top Job Poster", desc: "Shares multiple opportunities on the Job Board." },
  { icon: "🤝", name: "Referral Guru", desc: "Actively helps students with job referrals." },
  { icon: "🔥", name: "Hot Streak", desc: "Logged in and engaged for 7 consecutive days." },
  { icon: "📄", name: "Resume Reviewer", desc: "Provides detailed feedback on student resumes." },
  { icon: "💰", name: "Generous Donor", desc: "Contributed to the university fundraising portal." },
];

const AlumniBadges = () => {
  return (
    <div className="badges-container">
      <div className="badges-header">
        <h2>🏆 Alumni Leaderboard & Achievements</h2>
        <p>Recognizing the top contributors who go above and beyond to support our student community.</p>
      </div>

      <div className="badges-dashboard-grid">
        
        {/* Left Column: Podium & Recent */}
        <div className="badges-left-col">
          
          <div className="badges-section">
            <h3 className="section-title">Top Mentors of the Month</h3>
            <div className="podium-container">
              {MOCK_LEADERS.map((leader) => (
                <div key={leader.rank} className={`podium-step rank-${leader.rank}`}>
                  <div className="podium-avatar-wrapper">
                    <div className="podium-avatar" style={{ backgroundColor: leader.avatarColor }}>
                      {leader.name.charAt(0)}
                    </div>
                    {leader.rank === 1 && <div className="crown">👑</div>}
                  </div>
                  <div className="podium-info">
                    <h4>{leader.name}</h4>
                    <span className="podium-company">{leader.company}</span>
                    <span className="podium-points">{leader.points.toLocaleString()} pts</span>
                  </div>
                  <div className="podium-base">
                    <span>{leader.rank}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="badges-section">
            <h3 className="section-title">Recent Achievements</h3>
            <div className="recent-achievements-list">
              {RECENT_ACHIEVEMENTS.map(ach => (
                <div key={ach.id} className="achievement-card">
                  <div className="achievement-icon">{ach.badge.split(' ')[0]}</div>
                  <div className="achievement-details">
                    <p><strong>{ach.name}</strong> unlocked <span className="highlight-badge">{ach.badge.substring(2)}</span></p>
                    <p className="achievement-desc">{ach.desc}</p>
                    <span className="achievement-date">{ach.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Badge Directory */}
        <div className="badges-right-col">
          <div className="badges-section sticky-section">
            <h3 className="section-title">Badge Directory</h3>
            <p className="directory-subtitle">Unlock these badges by engaging with the community.</p>
            <div className="badge-directory-grid">
              {ALL_BADGES.map((b, index) => (
                <div key={index} className="directory-badge-card">
                  <div className="dir-icon">{b.icon}</div>
                  <div className="dir-info">
                    <h4>{b.name}</h4>
                    <p>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AlumniBadges;
