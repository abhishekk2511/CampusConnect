import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Profile from './components/Profile';
import Setprofile from './components/Setprofile';
import Editprofile from './components/Editprofile';

import { RollNoProvider } from './components/RollNoContext';
import './App.css';
import { Myprofile } from './components/Myprofile'
import { UploadForm } from './components/Myupload'

// ── Protected Route: redirects to /signin if no token ──
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/signin" replace />;
};

// ── Simple 404 page ──
const NotFound = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Outfit, sans-serif', background: '#f5f0e8', gap: '16px'
  }}>
    <h1 style={{ fontSize: '6rem', fontWeight: 800, color: '#0d0d0d', margin: 0, lineHeight: 1 }}>404</h1>
    <p style={{ fontSize: '1.1rem', color: '#7a7265' }}>Oops! This page doesn't exist.</p>
    <a href="/dashboard" style={{
      padding: '12px 28px', background: '#c9a84c', color: '#0d0d0d',
      borderRadius: '12px', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem'
    }}>← Back to Dashboard</a>
  </div>
);

function App() {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <>
    <RollNoProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/getprofile/:rollNo" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/setprofile" element={<ProtectedRoute><Setprofile /></ProtectedRoute>} />
          <Route path="/myprofile" element={<ProtectedRoute><Myprofile /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadForm /></ProtectedRoute>} />
          <Route path="/editprofile/:profileid" element={<ProtectedRoute><Editprofile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard forceTab="admin" /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </RollNoProvider>
    </>
  );
}

export default App;
