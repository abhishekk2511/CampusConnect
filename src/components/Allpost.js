import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './Allpost.css'; // Import the CSS file

const Allpost = () => {
  const [uploads, setUploads] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const MAX_LENGTH = 1000;

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/alluploads');
        setUploads(response.data);
      } catch (error) {
        console.error('Error fetching uploads:', error);
      }
    };

    fetchUploads();
    // Auto-refresh every 5 seconds so new posts appear without reload
    const interval = setInterval(fetchUploads, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="allpost-container">
      {uploads.length === 0 ? (
        <p style={{textAlign:'center', color:'#94a3b8', padding:'20px 0'}}>No posts yet — be the first to share! ✨</p>
      ) : (
        <ul className="allpost-upload-list">
          {uploads.map((upload) => (
            <li key={upload._id} className="allpost-item">
              <Link to={`/getprofile/${upload.rollNo}`} className="allpost-profile-link">
                <span className="allpost-name">{upload.name}</span>
                <span className="allpost-timestamp">{moment(upload.createdAt).fromNow()}</span>
              </Link>
              
              <div className="allpost-content">
                <p>
                  {upload.description.length > MAX_LENGTH
                    ? (expandedItems[upload._id] ? upload.description : upload.description.substring(0, MAX_LENGTH) + '...')
                    : upload.description}
                </p>
                {upload.description.length > MAX_LENGTH && (
                  <button onClick={() => toggleExpand(upload._id)}>
                    {expandedItems[upload._id] ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </div>

              {upload.image && (
                <div className="allpost-image-wrap">
                  <img
                    src={`http://localhost:5000/uploads/${upload.image}`}
                    alt={upload.description}
                    className="allpost-image"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Allpost;
