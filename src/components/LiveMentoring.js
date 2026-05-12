import React, { useState } from 'react';
import './LiveMentoring.css';

const MENTORS = [
  { id: 1, name: "Vikram Malhotra", role: "Sr. Software Engineer", company: "Google", expertise: ["System Design", "React", "Career Advice"], avatar: "V", color: "#0284c7" },
  { id: 2, name: "Sneha Patel", role: "Product Manager", company: "Stripe", expertise: ["Product Strategy", "PM Interviews", "Resume Review"], avatar: "S", color: "#e11d48" },
  { id: 3, name: "Rohan Desai", role: "Founder", company: "Y Combinator", expertise: ["Startups", "Fundraising", "MVP Building"], avatar: "R", color: "#16a34a" },
  { id: 4, name: "Priya Kapoor", role: "Data Scientist", company: "Amazon", expertise: ["Machine Learning", "Python", "Data Interviews"], avatar: "P", color: "#9333ea" },
];

const LiveMentoring = () => {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('');

  const handleBookClick = (mentor) => {
    setSelectedMentor(mentor);
    setShowBookingModal(true);
    setBookingStatus('');
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setBookingStatus('success');
    setTimeout(() => {
      setShowBookingModal(false);
      setSelectedMentor(null);
    }, 2000);
  };

  return (
    <div className="mentoring-container">
      {/* Hero / Benefits Section */}
      <div className="mentoring-hero">
        <div className="hero-content">
          <h2>1-on-1 Live Mentorship</h2>
          <p>Accelerate your career by booking personal video sessions with top alumni.</p>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <span className="benefit-icon">🎯</span>
              <h4>Mock Interviews</h4>
              <p>Practice technical and behavioral interviews before the real deal.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📄</span>
              <h4>Resume Reviews</h4>
              <p>Get line-by-line feedback to ensure your resume passes ATS filters.</p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">🗺️</span>
              <h4>Career Roadmapping</h4>
              <p>Feeling lost? Get a step-by-step guide on how to reach your dream role.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Mentors Section */}
      <div className="mentors-section">
        <h3>Available Mentors</h3>
        <p className="section-subtitle">Select an alumni expert and book a 30-minute session.</p>
        
        <div className="mentors-grid">
          {MENTORS.map(mentor => (
            <div key={mentor.id} className="mentor-card">
              <div className="mentor-header">
                <div className="mentor-avatar" style={{ backgroundColor: mentor.color }}>{mentor.avatar}</div>
                <div>
                  <h4>{mentor.name}</h4>
                  <p className="mentor-role">{mentor.role} @ <strong>{mentor.company}</strong></p>
                </div>
              </div>
              <div className="mentor-expertise">
                {mentor.expertise.map(skill => (
                  <span key={skill} className="expertise-tag">{skill}</span>
                ))}
              </div>
              <button className="book-btn" onClick={() => handleBookClick(mentor)}>Book Session</button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedMentor && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <button className="close-modal-btn" onClick={() => setShowBookingModal(false)}>✕</button>
            
            {bookingStatus === 'success' ? (
              <div className="booking-success">
                <div className="success-icon">✅</div>
                <h3>Session Booked!</h3>
                <p>An invite has been sent to your email. You can join the video call from your Messages tab at the scheduled time.</p>
              </div>
            ) : (
              <>
                <h3>Book with {selectedMentor.name}</h3>
                <p className="booking-subtitle">Select a time for your 30-minute video session.</p>
                
                <form onSubmit={handleConfirmBooking} className="booking-form">
                  <div className="form-group">
                    <label>Select Date</label>
                    <input type="date" required min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="form-group">
                    <label>Select Time Slot</label>
                    <select required>
                      <option value="">Choose a time...</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="4:30 PM">4:30 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>What do you want to discuss?</label>
                    <textarea rows="3" placeholder="E.g., I have an interview coming up and want to do a mock system design round..." required></textarea>
                  </div>
                  <button type="submit" className="confirm-book-btn">Confirm Booking</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMentoring;
