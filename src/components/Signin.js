import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Signin.css';

const Signin = () => {
  const [rollNo, setRollNo]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the real backend
      const result = await axios.post(
        "/api/signin",
        { rollNo, password }
      );

      const token = result.data.token;
      const role = result.data.role;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role || "");
        localStorage.removeItem("Info"); // ← Clear previous user's profile
        navigate("/dashboard");
      } else {
        alert("Login failed: No token received");
      }

    } catch (error) {
      console.error(error);
      alert("Login failed. Please check your roll number and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">

      {/* ── Left Panel ── */}
      <div className="signin-left">

        {/* Logo */}
        <Link to="/" className="signin-logo">
          Campus<span>Connect</span>
        </Link>

        {/* Big editorial text */}
        <div className="signin-left-content">
          <span className="eyebrow">Student & Alumni Portal</span>
          <h1>
            Welcome<br />
            <em>Back.</em>
          </h1>
          <div className="rule"></div>
          <p>
            Sign in to access mentorship, opportunities,
            and your entire college network — all in one place.
          </p>

          {/* Trust badges */}
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

        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=75"
          alt="Campus"
          className="signin-bg-img"
        />
        <div className="signin-left-overlay"></div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="signin-right">

        <div className="signin-form-wrap">

          {/* Header */}
          <div className="form-header">
            <span className="eyebrow-dark">Secure Login</span>
            <h2>Sign In to Your Account</h2>
            <p>Enter your roll number and password to continue.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="signin-form" noValidate>

            <div className="field-group">
              <label htmlFor="rollNo">Roll Number</label>
              <div className="input-wrap">
                <span className="input-icon">🎓</span>
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

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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

            <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? (
                <span className="spinner"></span>
              ) : (
                'Sign In →'
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="form-divider">
            <span></span>
            <p>New to CampusConnect?</p>
            <span></span>
          </div>

          {/* Sign up link */}
          <Link to="/signup" className="register-btn">
            Create an Account
          </Link>

          {/* Back to home */}
          <p className="back-home">
            <Link to="/">← Back to Home</Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Signin;