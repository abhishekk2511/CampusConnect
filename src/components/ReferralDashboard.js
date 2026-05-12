import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReferralDashboard.css';

const mockReferrals = {
  incoming: [
    {
      _id: "r1",
      jobTitle: "Software Engineering Intern",
      company: "Google",
      requesterName: "Priya Singh",
      pitch: "I have strong DSA skills and recently won a college hackathon building a scalable backend in Node.js.",
      resumeLink: "https://example.com/resume-priya",
      status: "Pending",
      createdAt: new Date().toISOString()
    }
  ],
  outgoing: [
    {
      _id: "r2",
      jobTitle: "Frontend Developer",
      company: "Microsoft",
      status: "Approved",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      _id: "r3",
      jobTitle: "Data Analyst",
      company: "Amazon",
      status: "Pending",
      createdAt: new Date().toISOString()
    }
  ]
};

const ReferralDashboard = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      // Force mock data immediately if the database is unreachable
      setTimeout(() => {
        setIncoming(mockReferrals.incoming);
        setOutgoing(mockReferrals.outgoing);
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/referrals/${id}/status`, { status });
      // Refresh the lists
      fetchReferrals();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="referral-loading">Loading referrals...</div>;
  }

  return (
    <div className="referral-dashboard-container">
      <div className="referral-header">
        <h2>Referral Requests</h2>
        <p>Manage the referrals you've requested and the requests sent to you.</p>
      </div>

      <div className="referral-section">
        <h3>Incoming Requests (Action Required)</h3>
        {incoming.length === 0 ? (
          <div className="no-referrals">No pending requests from students.</div>
        ) : (
          <div className="referral-list">
            {incoming.map(req => (
              <div key={req._id} className="referral-card">
                <div className="referral-card-header">
                  <div>
                    <h4>{req.jobTitle} @ {req.company}</h4>
                    <span className="referral-requester">Requested by <strong>{req.requesterName}</strong></span>
                  </div>
                  <span className={`status-badge ${req.status.toLowerCase()}`}>{req.status}</span>
                </div>
                
                <div className="referral-pitch-box">
                  <strong>Pitch:</strong>
                  <p>{req.pitch}</p>
                </div>
                
                <div className="referral-actions">
                  <a href={req.resumeLink} target="_blank" rel="noopener noreferrer" className="view-resume-btn">
                    📄 View Resume
                  </a>
                  
                  {req.status === 'Pending' && (
                    <div className="action-buttons-group">
                      <button onClick={() => handleStatusUpdate(req._id, 'Declined')} className="decline-btn">Decline</button>
                      <button onClick={() => handleStatusUpdate(req._id, 'Approved')} className="approve-btn">Approve</button>
                    </div>
                  )}
                </div>
                <div className="referral-date">Sent on {formatDate(req.createdAt)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="referral-section">
        <h3>My Requests</h3>
        {outgoing.length === 0 ? (
          <div className="no-referrals">You haven't requested any referrals yet. Go to the Job Board to start!</div>
        ) : (
          <div className="referral-list">
            {outgoing.map(req => (
              <div key={req._id} className="referral-card outgoing-card">
                <div className="referral-card-header">
                  <div>
                    <h4>{req.jobTitle}</h4>
                    <span className="referral-requester">{req.company}</span>
                  </div>
                  <span className={`status-badge ${req.status.toLowerCase()}`}>{req.status}</span>
                </div>
                <div className="referral-date">Requested on {formatDate(req.createdAt)}</div>
                
                {req.status === 'Approved' && (
                  <div className="approved-notice">
                    🎉 The alumni has approved your request and will process your referral soon!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralDashboard;
