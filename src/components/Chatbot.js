import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi! I'm your Alumni Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post('/api/chat', { message: userMsg });
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: "Oops, I'm having trouble connecting right now. Try again later!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
      <button className="chatbot-toggle-btn" onClick={toggleChat}>
        {isOpen ? '✕' : '💬'}
      </button>

      <div className="chatbot-window">
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <span className="chatbot-avatar">✨</span>
            <div>
              <h4>Alumni Assistant</h4>
              <p>Online</p>
            </div>
          </div>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.sender === 'bot' && <div className="chat-avatar">🤖</div>}
              <div className="chat-bubble">{msg.text}</div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-message bot">
              <div className="chat-avatar">🤖</div>
              <div className="chat-bubble typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot-input-area" onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
          />
          <button type="submit" disabled={!input.trim()}>➤</button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
