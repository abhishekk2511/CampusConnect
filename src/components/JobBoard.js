import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobBoard.css';

const mockJobsData = [
  {
    _id: "1",
    title: "Software Engineering Intern",
    company: "Google",
    location: "Bangalore, India",
    type: "Internship",
    description: "Join Google's core search team for a 6-month internship. You will work on scalable backend systems using C++ and Go. Strong data structures and algorithms knowledge required.",
    applyLink: "https://careers.google.com/jobs/results/",
    postedBy: { name: "Vikram Malhotra" },
    createdAt: new Date().toISOString()
  },
  {
    _id: "2",
    title: "Frontend Developer",
    company: "Microsoft",
    location: "Hyderabad, India (Hybrid)",
    type: "Full-time",
    description: "Looking for a passionate React developer to join the MS Teams frontend division. You should have 1-2 years of experience with React, Redux, and modern CSS frameworks.",
    applyLink: "https://careers.microsoft.com/",
    postedBy: { name: "Rohan Verma" },
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    _id: "3",
    title: "Data Analyst",
    company: "Amazon",
    location: "Remote",
    type: "Contract",
    description: "6-month contract role for a Data Analyst. Proficiency in SQL, Python, and Tableau required. You will be analyzing customer purchase patterns and generating actionable insights.",
    applyLink: "hr@amazon-analytics.example.com",
    postedBy: { name: "Neha Joshi" },
    createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
];

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    description: '',
    applyLink: ''
  });

  const [referralData, setReferralData] = useState({
    pitch: '',
    resumeLink: ''
  });

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: 'All'
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { search, location, type } = filters;
      let url = '/api/jobs?';
      if (search) url += `search=${search}&`;
      if (location) url += `location=${location}&`;
      if (type && type !== 'All') url += `type=${type}&`;

      const res = await axios.get(url);
      const realJobs = res.data || [];
      setJobs(realJobs.length > 0 ? [...realJobs, ...mockJobsData] : mockJobsData);
    } catch (error) {
      console.error("Jobs API failed, using mock data:", error);
      setJobs(mockJobsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // For simplicity we try to get user info from local storage if available
      const userInfo = JSON.parse(localStorage.getItem('Info')) || {};
      
      const payload = {
        ...formData,
        token,
        name: userInfo.name,
        rollNo: userInfo.id || userInfo.rollNo
      };

      await axios.post('/api/jobs', payload);
      setShowModal(false);
      setFormData({
        title: '', company: '', location: '', type: 'Full-time', description: '', applyLink: ''
      });
      fetchJobs(); // Refresh jobs list
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job");
    }
  };

  const handleReferralChange = (e) => {
    const { name, value } = e.target;
    setReferralData({ ...referralData, [name]: value });
  };

  const handleReferralSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      const token = localStorage.getItem('token');
      const userInfo = JSON.parse(localStorage.getItem('Info')) || {};
      
      const payload = {
        jobId: selectedJob._id,
        jobTitle: selectedJob.title,
        company: selectedJob.company,
        receiverRollNo: selectedJob.postedBy?.rollNo || "Unknown",
        requesterName: userInfo.name || "Student User",
        requesterRollNo: userInfo.id || userInfo.rollNo || "13920803122",
        pitch: referralData.pitch,
        resumeLink: referralData.resumeLink,
        token
      };

      await axios.post('/api/referrals', payload);
      setShowReferralModal(false);
      setSelectedJob(null);
      setReferralData({ pitch: '', resumeLink: '' });
      alert("Referral request sent successfully!");
    } catch (error) {
      console.error("Error submitting referral:", error);
      alert("Failed to send referral request");
    }
  };

  const openReferralModal = (job) => {
    setSelectedJob(job);
    setShowReferralModal(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="job-board-container">
      <div className="job-board-header">
        <div>
          <h2>Job & Internship Board</h2>
          <p className="job-subtitle">Discover opportunities shared by your alumni network</p>
        </div>
        <button className="post-job-btn" onClick={() => setShowModal(true)}>
          <span>＋</span> Post a Job
        </button>
      </div>

      <div className="job-filters-bar">
        <div className="filter-input-wrap">
          <span className="filter-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search title or company..." 
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        <div className="filter-input-wrap">
          <span className="filter-icon">📍</span>
          <input 
            type="text" 
            placeholder="Location..." 
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
          />
        </div>
        <select 
          className="filter-select"
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
        >
          <option value="All">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>
      </div>

      {loading ? (
        <div className="jobs-loading">Loading opportunities...</div>
      ) : jobs.length === 0 ? (
        <div className="no-jobs">
          <p>No jobs or internships posted yet.</p>
          <button onClick={() => setShowModal(true)} style={{marginTop: '10px'}} className="post-job-btn">Be the first to post!</button>
        </div>
      ) : (
        <div className="jobs-list">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-card-header">
                <div>
                  <h3 className="job-card-title">{job.title}</h3>
                  <div className="job-card-company">{job.company}</div>
                </div>
                <span className="job-badge">{job.type}</span>
              </div>
              
              <div className="job-card-meta">
                <div className="job-meta-item">
                  <span>📍</span> {job.location}
                </div>
                <div className="job-meta-item">
                  <span>🕒</span> Posted {formatDate(job.createdAt)}
                </div>
              </div>
              
              <div className="job-card-desc">
                {job.description}
              </div>
              
              <div className="job-card-footer">
                <div className="job-posted-by">
                  Posted by: <strong>{job.postedBy?.name || 'Alumni'}</strong>
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button 
                    className="job-apply-btn" 
                    style={{backgroundColor: '#10b981'}}
                    onClick={() => openReferralModal(job)}
                  >
                    Request Referral
                  </button>
                  <a 
                    href={job.applyLink.startsWith('http') ? job.applyLink : `mailto:${job.applyLink}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="job-apply-btn"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for posting jobs */}
      {showModal && (
        <div className="job-modal-overlay">
          <div className="job-modal">
            <h3>Post a Job / Internship</h3>
            <form onSubmit={handleSubmit}>
              <div className="job-form-group">
                <label>Job Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Software Engineer Intern" />
              </div>
              <div className="job-form-group">
                <label>Company</label>
                <input required type="text" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Google" />
              </div>
              <div className="job-form-group">
                <label>Location</label>
                <input required type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Remote, Bangalore" />
              </div>
              <div className="job-form-group">
                <label>Employment Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div className="job-form-group">
                <label>Description & Requirements</label>
                <textarea required rows="4" name="description" value={formData.description} onChange={handleChange} placeholder="Briefly describe the role..."></textarea>
              </div>
              <div className="job-form-group">
                <label>Apply Link or Email</label>
                <input required type="text" name="applyLink" value={formData.applyLink} onChange={handleChange} placeholder="e.g. https://careers.google.com/... or hr@company.com" />
              </div>
              <div className="job-form-actions">
                <button type="button" className="job-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="job-submit-btn">Post Opportunity</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for requesting a referral */}
      {showReferralModal && selectedJob && (
        <div className="job-modal-overlay">
          <div className="job-modal">
            <h3>Request Referral for {selectedJob.company}</h3>
            <p style={{marginBottom: '20px', color: '#4b5563'}}>
              Send a request to <strong>{selectedJob.postedBy?.name || 'the poster'}</strong> for the <strong>{selectedJob.title}</strong> role.
            </p>
            <form onSubmit={handleReferralSubmit}>
              <div className="job-form-group">
                <label>Why are you a good fit? (Pitch)</label>
                <textarea 
                  required 
                  rows="4" 
                  name="pitch" 
                  value={referralData.pitch} 
                  onChange={handleReferralChange} 
                  placeholder="Briefly explain your relevant skills and why you want this role..."
                ></textarea>
              </div>
              <div className="job-form-group">
                <label>Resume Link</label>
                <input 
                  required 
                  type="url" 
                  name="resumeLink" 
                  value={referralData.resumeLink} 
                  onChange={handleReferralChange} 
                  placeholder="e.g. Google Drive or Dropbox link" 
                />
              </div>
              <div className="job-form-actions">
                <button type="button" className="job-cancel-btn" onClick={() => setShowReferralModal(false)}>Cancel</button>
                <button type="submit" className="job-submit-btn">Send Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;
