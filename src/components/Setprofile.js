// src/ProfileSetup.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Setprofile.css';  // Import the CSS file

const Setprofile = () => {
  const token = localStorage.getItem("token");
  const [storedtoken, setToken] = useState(token || "");
  console.log(token,"token mil gaya")
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [setimage, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [role, setRole] = useState("");
  
  useEffect(() => {
    if (storedtoken) {
      try {
        const base64Url = storedtoken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        setRole(decoded.role || "");
      } catch (e) {
        console.error("Token decode error", e);
      }
    }
  }, [storedtoken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("year", year);
    formData.append("branch", branch);
    formData.append("setimage", setimage);
    formData.append("email", email);
    formData.append("company", company);
    formData.append("jobTitle", jobTitle);
    formData.append("storedtoken", storedtoken);
     
    try {
      const response = await axios.post(`http://localhost:5000/api/setprofile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Save to localStorage so dashboard shows this user's info instantly
      const profileInfo = {
        name: name,
        branch: branch,
        email: email,
        image: response.data.image,
        role: role,
        company: company,
        jobTitle: jobTitle,
        rollNo: response.data.rollNo ? String(response.data.rollNo) : ""
      };
      localStorage.setItem("Info", JSON.stringify(profileInfo));

      alert("Profile created successfully! 🎉");
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      alert("Failed to create profile. Please try again.");
    }
  };

  return (


    <div className="set-profile-wrapper">
      <div className="set-profile-card">
        <div className="set-profile-header">
          <h2>Complete Your Profile</h2>
          <p>Tell the GGSIPU community more about yourself</p>
        </div>

        <form onSubmit={handleSubmit} className="set-profile-form">
          <div className="image-upload-section">
            <div className="avatar-preview">
              {setimage ? (
                <img src={URL.createObjectURL(setimage)} alt="Preview" />
              ) : (
                <div className="avatar-placeholder">
                  <span>📸</span>
                </div>
              )}
            </div>
            <label className="file-input-label">
              Choose Profile Photo
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                required
                accept="image/*"
              />
            </label>
          </div>

          <div className="form-grid">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Abhishek Kumar"
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="abhishek@example.com"
              />
            </div>

            <div className="input-group">
              <label>Year (Join/Graduation)</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                placeholder="e.g. 2024"
              />
            </div>

            <div className="input-group">
              <label>Department / Branch</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
                placeholder="e.g. Computer Science"
              />
            </div>

            {role === "Alumni" && (
              <>
                <div className="input-group">
                  <label>Current Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                <div className="input-group">
                  <label>Current Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    placeholder="e.g. Google / Microsoft"
                  />
                </div>
              </>
            )}
          </div>

          <button type="submit" className="set-profile-submit">
            Finish Setup & Launch Dashboard →
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setprofile;
