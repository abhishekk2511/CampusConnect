import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FriendSystem.css';

const FriendSystem = ({ setActiveTab, setSelectedFriend }) => {
    const token = localStorage.getItem("token");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [requests, setRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState("search"); // search, requests, friends

    useEffect(() => {
        fetchRequests();
        fetchFriends();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axios.post("/api/friends/get-requests", { token });
            setRequests(response.data);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        }
    };

    const fetchFriends = async () => {
        try {
            const response = await axios.post("/api/friends/list", { token });
            setFriends(response.data);
        } catch (error) {
            console.error("Failed to fetch friends", error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            const response = await axios.post("/api/people/search", { query: searchQuery });
            setSearchResults(response.data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const [sentInSession, setSentInSession] = useState([]);

    const sendFriendRequest = async (rollNo) => {
        try {
            await axios.post("/api/friends/request", { token, targetRollNo: rollNo });
            setSentInSession([...sentInSession, rollNo]);
            alert("Friend request sent! 🎉");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to send request");
        }
    };

    const handleRequestAction = async (requestId, action) => {
        try {
            await axios.post("/api/friends/handle-request", { token, requestId, action });
            fetchRequests();
            if (action === 'accept') fetchFriends();
        } catch (error) {
            console.error("Action failed", error);
        }
    };

    return (
        <div className="friend-system-container">
            <div className="friend-system-header">
                <button 
                    className={activeSection === "search" ? "active" : ""} 
                    onClick={() => setActiveSection("search")}
                >🔍 Search People</button>
                <button 
                    className={activeSection === "requests" ? "active" : ""} 
                    onClick={() => setActiveSection("requests")}
                >📩 Requests {requests.length > 0 && <span className="badge">{requests.length}</span>}</button>
                <button 
                    className={activeSection === "friends" ? "active" : ""} 
                    onClick={() => setActiveSection("friends")}
                >👥 My Friends</button>
            </div>

            <div className="friend-system-content">
                {activeSection === "search" && (
                    <div className="search-section">
                        <form onSubmit={handleSearch} className="friend-search-bar">
                            <input 
                                type="text" 
                                placeholder="Search by Name or Roll Number..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit">Search</button>
                        </form>

                        <div className="search-results">
                            {loading ? (
                                <p className="loading-msg">Searching...</p>
                            ) : searchResults.length === 0 && searchQuery ? (
                                <p className="empty-msg">No people found matching "{searchQuery}"</p>
                            ) : searchResults.map(person => (
                                <div key={person.rollNo} className="person-card">
                                    <div className="person-avatar">
                                        {person.image ? (
                                            <img src={`/uploads/${person.image}`} alt={person.name} />
                                        ) : (
                                            person.name.charAt(0)
                                        )}
                                    </div>
                                    <div className="person-info">
                                        <h4>{person.name}</h4>
                                        <p>{person.branch} · #{person.rollNo}</p>
                                    </div>
                                    <button 
                                        className={`send-req-btn ${sentInSession.includes(person.rollNo) ? 'sent' : ''}`}
                                        onClick={() => sendFriendRequest(person.rollNo)}
                                        disabled={sentInSession.includes(person.rollNo)}
                                    >
                                        {sentInSession.includes(person.rollNo) ? 'Sent' : 'Send'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === "requests" && (
                    <div className="requests-section">
                        {requests.length === 0 ? <p className="empty-msg">No pending requests</p> : requests.map(req => (
                            <div key={req._id} className="request-card">
                                <div className="person-avatar">
                                    {req.from.image ? (
                                        <img src={`/uploads/${req.from.image}`} alt={req.from.name} />
                                    ) : (
                                        req.from.name.charAt(0)
                                    )}
                                </div>
                                <div className="person-info">
                                    <h4>{req.from.name}</h4>
                                    <p>{req.from.branch} · #{req.from.rollNo}</p>
                                </div>
                                <div className="req-actions">
                                    <button className="accept-btn" onClick={() => handleRequestAction(req._id, 'accept')}>Accept</button>
                                    <button className="reject-btn" onClick={() => handleRequestAction(req._id, 'reject')}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeSection === "friends" && (
                    <div className="friends-section">
                        {friends.length === 0 ? <p className="empty-msg">No friends yet. Start connecting!</p> : friends.map(friend => (
                            <div key={friend.rollNo} className="friend-card">
                                <div className="person-avatar">
                                    {friend.image ? (
                                        <img src={`/uploads/${friend.image}`} alt={friend.name} />
                                    ) : (
                                        friend.name.charAt(0)
                                    )}
                                </div>
                                <div className="person-info">
                                    <h4>{friend.name}</h4>
                                    <p>{friend.branch} · #{friend.rollNo}</p>
                                    {friend.jobTitle && <p className="job-tag">{friend.jobTitle} @ {friend.company}</p>}
                                </div>
                                <button 
                                    className="chat-btn"
                                    onClick={() => {
                                        setSelectedFriend(friend);
                                        setActiveTab("messages");
                                    }}
                                >Message</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendSystem;
