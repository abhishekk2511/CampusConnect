import React, { useState } from 'react';
import './Message.css';
import axios from "axios";
import { useParams } from 'react-router-dom';

const MessagePopup = ({ isOpen, onClose }) => {
  const { rollNo } = useParams(); 
  const [description, setMessage] = useState('');
  const [Info] = useState(localStorage.getItem('Info') || '');
  
  let allinfo = {};
  if (Info) {
      try {
          allinfo = JSON.parse(Info);
      } catch (e) {
          // Ignore
      }
  }

  const name = allinfo.name;
  const branch = allinfo.branch;
  const email = allinfo.email;
  const id = allinfo.id;

  const handleSendClick = () => {
    const sendmessage = async () => {
      try {
        await axios.post('http://localhost:5000/api/message', { rollNo, name, id, email, branch, description });
        alert("message sent");
      } catch(err) {
        console.log(err);
      }   
    }
    sendmessage();
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
        <div className="popup-content">
            <span className="close-btn" onClick={onClose}>&times;</span>
            <h2>Send a Message</h2>
            <textarea 
                value={description}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows="5"
            />
            <button className="send-btn" onClick={handleSendClick}>Send</button>
        </div>
    </div>
  );
};

export default MessagePopup;
