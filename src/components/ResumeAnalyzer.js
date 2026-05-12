import React, { useState, useRef } from 'react';
import axios from 'axios';
import './ResumeAnalyzer.css';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, results
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('loading');
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResults(response.data);
      setStatus('results');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Failed to analyze resume. Please try again.');
      setStatus('idle');
    }
  };

  const resetAnalyzer = () => {
    setFile(null);
    setResults(null);
    setStatus('idle');
  };

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    return 'needs-work';
  };

  return (
    <div className="resume-analyzer-container">
      <div className="analyzer-header">
        <h2>AI Resume Analyzer</h2>
        <p>Upload your resume to get instant feedback and an ATS compatibility score.</p>
      </div>

      {status === 'idle' && (
        <div 
          className={`upload-zone ${isDragging ? 'drag-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
        >
          <div className="upload-icon">📄</div>
          <h3>{file ? file.name : 'Drag & drop your resume here'}</h3>
          <p>{file ? 'Ready to analyze' : 'Supports PDF, DOCX (Max 5MB)'}</p>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }} 
          />
          
          {file ? (
            <button className="upload-btn" onClick={(e) => { e.stopPropagation(); handleUpload(); }}>
              Analyze Resume Now
            </button>
          ) : (
            <button className="upload-btn" onClick={(e) => { e.preventDefault(); }}>
              Browse Files
            </button>
          )}
        </div>
      )}

      {status === 'loading' && (
        <div className="analyzer-loading">
          <div className="loader-spinner"></div>
          <p>Analyzing your resume...</p>
        </div>
      )}

      {status === 'results' && results && (
        <div className="analyzer-results">
          <div className="score-section">
            <div 
              className={`score-circle ${getScoreColorClass(results.score)}`}
              style={{ '--score-deg': `${(results.score / 100) * 360}deg`, background: `conic-gradient(currentColor ${results.score}%, #e5e7eb 0deg)` }}
            >
              <span>{results.score}</span>
            </div>
            <div className="score-label">Overall Score</div>
          </div>
          
          <div className="feedback-section">
            <h3>Key Feedback</h3>
            <ul className="feedback-list">
              {results.feedback.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="action-buttons">
            <button className="retry-btn" onClick={resetAnalyzer}>Upload Another Resume</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
