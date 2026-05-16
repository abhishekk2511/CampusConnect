import React, { useState } from 'react';
import axios from 'axios';
import './PollWidget.css';

const PollWidget = ({ poll, onVote }) => {
    const [voting, setVoting] = useState(false);
    const token = localStorage.getItem('token');
    const userRollNo = JSON.parse(localStorage.getItem('Info'))?.rollNo;

    const hasVoted = poll.voters.includes(userRollNo);
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

    const handleVote = async (index) => {
        if (hasVoted || voting) return;
        setVoting(true);
        try {
            const res = await axios.post('http://localhost:5000/api/polls/vote', {
                pollId: poll._id,
                optionIndex: index,
                token
            });
            onVote(res.data);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to vote");
        } finally {
            setVoting(false);
        }
    };

    return (
        <div className="poll-card">
            <div className="poll-header">
                <img 
                    src={poll.createdBy.image?.startsWith('http') ? poll.createdBy.image : `http://localhost:5000/uploads/${poll.createdBy.image || 'default.png'}`} 
                    alt="" 
                    className="poll-author-img"
                />
                <div className="poll-author-info">
                    <strong>{poll.createdBy.name}</strong>
                    <span>asked a question</span>
                </div>
            </div>

            <h3 className="poll-question">{poll.question}</h3>

            <div className="poll-options">
                {poll.options.map((option, index) => {
                    const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                    return (
                        <button 
                            key={index} 
                            className={`poll-option ${hasVoted ? 'voted' : ''}`}
                            onClick={() => handleVote(index)}
                            disabled={hasVoted || voting}
                        >
                            <div className="poll-option-content">
                                <span>{option.text}</span>
                                {hasVoted && <span className="poll-percentage">{percentage}%</span>}
                            </div>
                            {hasVoted && (
                                <div 
                                    className="poll-progress" 
                                    style={{ width: `${percentage}%` }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="poll-footer">
                <span>{totalVotes} votes</span>
                <span>•</span>
                <span>{hasVoted ? 'Voted' : 'Select an option to vote'}</span>
            </div>
        </div>
    );
};

export default PollWidget;
