import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole]         = useState('student');
  const [rollNo, setRollNo]     = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [setimage, setImage] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');

  const requestOtp = async (e) => {
    e.preventDefault();
    if (!rollNo || !password || !name || !email || !year || !branch) {
      alert("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/send-otp", { email });
      setShowOtpModal(true);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send OTP. Please check your email address.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const verifyAndSignup = async () => {
    if (!otp || otp.length < 6) return alert("Please enter the 6-digit OTP");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('role', role);
      formData.append('rollNo', rollNo);
      formData.append('password', password);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('year', year);
      formData.append('branch', branch);
      formData.append('company', company);
      formData.append('jobTitle', jobTitle);
      if (setimage) {
        formData.append('image', setimage);
      }
      formData.append('otp', otp);

      await axios.post("http://localhost:5000/api/signup", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Account created successfully! Please sign in.');
      navigate('/signin');
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong during signup. Please try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      {/* ── Left Panel ── */}
      <div className="signup-left">

        <Link to="/" className="signup-logo">
          Campus<span>Connect</span>
        </Link>

        <div className="signup-left-content">
          <span className="eyebrow">Join the Community</span>
          <h1>
            Start Your<br />
            <em>Journey.</em>
          </h1>
          <div className="rule"></div>
          <p>
            Create your account and unlock access to mentors,
            alumni connections, job opportunities, and a thriving
            campus network built just for you.
          </p>

          <div className="trust-row">
            <div className="trust-item">
              <span className="trust-num">500+</span>
              <span className="trust-label">Alumni</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <span className="trust-num">300+</span>
              <span className="trust-label">Mentors</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <span className="trust-num">1.2k</span>
              <span className="trust-label">Students</span>
            </div>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=75"
          alt="Campus"
          className="signup-bg-img"
        />
        <div className="signup-left-overlay"></div>
      </div>

      {/* ── Right Panel ── */}
      <div className="signup-right">
        <div className="signup-form-wrap">

          <div className="form-header">
            <span className="eyebrow-dark">
              {role === 'student' ? '🎓 Student Registration' : '👔 Alumni Registration'}
            </span>
            <h2>Create Your Account</h2>
            <p>Fill in the details below to get started.</p>
          </div>

          <form onSubmit={requestOtp} className="signup-form" noValidate>

            {/* Role Selector */}
            <div className="field-group">
              <label>I am a</label>
              <div className="role-toggle">
                <button
                  type="button"
                  className={`role-btn ${role === 'student' ? 'active' : ''}`}
                  onClick={() => setRole('student')}
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  className={`role-btn ${role === 'alumni' ? 'active' : ''}`}
                  onClick={() => setRole('alumni')}
                >
                  👔 Alumni
                </button>
              </div>
            </div>

            {/* Roll No */}
            <div className="field-group">
              <label htmlFor="rollNo">Roll Number</label>
              <div className="input-wrap">
                <span className="input-icon">🪪</span>
                <input
                  id="rollNo"
                  type="text"
                  placeholder="e.g. 21CS001"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(!showPass)}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="field-group">
              <label>Full Name</label>
              <div className="input-wrap">
                <input type="text" placeholder="e.g. Abhishek Kumar" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>
            
            <div className="field-group">
              <label>Email Address</label>
              <div className="input-wrap">
                <input type="email" placeholder="abhishek@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="field-group">
              <label>Year (Join/Graduation)</label>
              <div className="input-wrap">
                <input type="number" placeholder="e.g. 2024" value={year} onChange={(e) => setYear(e.target.value)} required />
              </div>
            </div>

            <div className="field-group">
              <label>Department / Branch</label>
              <div className="input-wrap">
                <input type="text" placeholder="e.g. Computer Science" value={branch} onChange={(e) => setBranch(e.target.value)} required />
              </div>
            </div>

            {role === "alumni" && (
              <>
                <div className="field-group">
                  <label>Current Job Title</label>
                  <div className="input-wrap">
                    <input type="text" placeholder="e.g. Senior Software Engineer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
                  </div>
                </div>

                <div className="field-group">
                  <label>Current Company</label>
                  <div className="input-wrap">
                    <input type="text" placeholder="e.g. Google / Microsoft" value={company} onChange={(e) => setCompany(e.target.value)} required />
                  </div>
                </div>
              </>
            )}

            <div className="field-group">
              <label>Profile Photo</label>
              <div className="input-wrap">
                <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
              </div>
            </div>

            <button type="submit" className="signup-submit-btn" disabled={loading} onClick={requestOtp}>
              {loading ? "Sending OTP..." : "Create Account"}
            </button>

          </form>

          <div className="form-divider">
            <span></span>
            <p>Already have an account?</p>
            <span></span>
          </div>

          <Link to="/signin" className="signin-btn">
            Sign In Instead
          </Link>

          <p className="back-home">
            <Link to="/">← Back to Home</Link>
          </p>

        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="otp-modal-overlay">
          <div className="otp-modal">
            <h3>Email Verification</h3>
            <p>We've sent a 6-digit OTP to <strong>{email}</strong>.</p>
            <p className="otp-note">Check your console/terminal if SMTP is not configured.</p>
            
            <input 
              type="text" 
              maxLength="6"
              placeholder="Enter 6-digit OTP" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} 
              className="otp-input"
            />
            
            <div className="otp-actions">
              <button 
                className="otp-cancel-btn" 
                onClick={() => { setShowOtpModal(false); setOtp(''); }}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="otp-verify-btn" 
                onClick={verifyAndSignup}
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify & Sign Up"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Signup;