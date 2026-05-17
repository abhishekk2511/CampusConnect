import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './Message.css';

const Messages = ({ selectedFriend }) => {
    const token = localStorage.getItem("token");
    const [conversations, setConversations] = useState([]);
    const [activeConvo, setActiveConvo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(true);
    const chatEndRef = useRef(null);

    // Video Call States
    const [isVideoCallActive, setIsVideoCallActive] = useState(false);
    const [stream, setStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const localVideoRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (activeConvo) {
            fetchMessages(activeConvo.otherUser._id);
            
            // Connect to WebSocket
            const socket = io(window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');
            
            socket.on('newMessage', (msgObj) => {
                // If message belongs to current chat
                if (msgObj.sender === activeConvo.otherUser._id || msgObj.receiverId === activeConvo.otherUser._id) {
                   fetchMessages(activeConvo.otherUser._id);
                }
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [activeConvo]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (conversations.length > 0 && selectedFriend) {
            const found = conversations.find(c => c.otherUser._id === selectedFriend._id);
            if (found) {
                setActiveConvo(found);
            } else {
                // If not in conversations list yet (no messages), create a temporary one
                setActiveConvo({
                    id: selectedFriend._id,
                    otherUser: selectedFriend,
                    lastMessage: "No messages yet",
                    time: ""
                });
            }
        }
    }, [selectedFriend, conversations]);

    const fetchConversations = async () => {
        try {
            // First get friends to show as potential conversations
            const friendsRes = await axios.post("/api/friends/list", { token });
            const friends = friendsRes.data;

            // Then get actual conversation metadata
            const convosRes = await axios.post("/api/private/conversations", { token });
            const realConvos = convosRes.data;

            // Merge friends into conversations list
            const merged = friends.map(friend => {
                const existing = realConvos.find(c => c.participants.some(p => p._id === friend._id));
                return {
                    id: friend._id,
                    otherUser: friend,
                    lastMessage: existing ? existing.messages[existing.messages.length - 1]?.text : "No messages yet",
                    time: existing ? new Date(existing.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""
                };
            });

            setConversations(merged);
            if (merged.length > 0 && !activeConvo) setActiveConvo(merged[0]);
        } catch (error) {
            console.error("Failed to fetch conversations", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (otherUserId) => {
        try {
            const res = await axios.post("/api/private/messages", { token, otherUserId });
            setMessages(res.data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const handleSend = async () => {
        if (!replyText.trim() || !activeConvo) return;
        try {
            const res = await axios.post("/api/private/send", {
                token,
                receiverId: activeConvo.otherUser._id,
                text: replyText
            });
            setReplyText('');
            fetchMessages(activeConvo.otherUser._id);
        } catch (error) {
            console.error("Failed to send", error);
        }
    };

    const startVideoCall = async () => {
        setIsVideoCallActive(true);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(mediaStream);
            if (localVideoRef.current) localVideoRef.current.srcObject = mediaStream;
        } catch (err) {
            console.error("Video call failed", err);
        }
    };

    const endVideoCall = () => {
        setIsVideoCallActive(false);
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    if (loading) return <div className="messages-loading">Loading conversations...</div>;

    return (
        <div className="messages-page-wrapper">
            <div className="messages-sidebar">
                <h2 className="messages-title">Messages</h2>
                <div className="conversations-list">
                    {conversations.length === 0 ? (
                        <p className="no-friends-msg">No friends yet. Add some from the Networking Hub!</p>
                    ) : conversations.map(convo => (
                        <div 
                           key={convo.id} 
                           className={`conversation-item ${activeConvo?.id === convo.id ? 'active' : ''}`}
                           onClick={() => setActiveConvo(convo)}
                        >
                            <div className="avatar">
                                {convo.otherUser.image ? (
                                    <img src={`/uploads/${convo.otherUser.image}`} alt="" />
                                ) : (
                                    convo.otherUser.name.charAt(0)
                                )}
                            </div>
                            <div className="convo-info">
                                <div className="convo-header">
                                    <span className="convo-name">{convo.otherUser.name}</span>
                                    <span className="convo-time">{convo.time}</span>
                                </div>
                                <div className="convo-last-msg">{convo.lastMessage}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="messages-main">
                {activeConvo ? (
                    <>
                        <div className="chat-header">
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                <div className="avatar">
                                    {activeConvo.otherUser.image ? (
                                        <img src={`/uploads/${activeConvo.otherUser.image}`} alt="" />
                                    ) : (
                                        activeConvo.otherUser.name.charAt(0)
                                    )}
                                </div>
                                <div className="chat-header-info">
                                    <h3>{activeConvo.otherUser.name}</h3>
                                    <p>{activeConvo.otherUser.branch} · GGSIPU</p>
                                </div>
                            </div>
                            <button className="video-call-btn" onClick={startVideoCall}>
                                📹 <span className="tooltip">Start Video Call</span>
                            </button>
                        </div>
                        <div className="chat-area">
                            {messages.map((msg, i) => {
                                // msg.sender is populated, so it's an object. 
                                // We need to check the ID.
                                const isReceived = (msg.sender?._id?.toString() || msg.sender?.toString()) === activeConvo.otherUser._id?.toString();
                                return (
                                    <div key={i} className={`chat-bubble-wrap ${isReceived ? 'received' : 'sent'}`}>
                                        <div className="chat-bubble">
                                            <p>{msg.text}</p>
                                            <span className="chat-time">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="chat-input-area">
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button className="chat-send-btn" onClick={handleSend}>Send</button>
                        </div>
                    </>
                ) : (
                    <div className="no-chat-selected">Select a friend to start messaging</div>
                )}
            </div>

            {isVideoCallActive && (
                <div className="video-call-overlay">
                    <div className="video-call-container">
                        <div className="remote-video-feed">
                            <div className="remote-user-placeholder">
                                {activeConvo?.otherUser.name.charAt(0)}
                            </div>
                            <p className="call-status">Calling {activeConvo?.otherUser.name}...</p>
                        </div>
                        <div className="local-video-feed">
                            <video ref={localVideoRef} autoPlay playsInline muted />
                        </div>
                        <div className="call-controls">
                            <button className="control-btn end-call" onClick={endVideoCall}>📞 End</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
