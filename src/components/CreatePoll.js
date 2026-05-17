import React, { useState } from 'react';
import axios from 'axios';
import './CreatePoll.css';

const CreatePoll = ({ onPollCreated, onClose }) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [loading, setLoading] = useState(false);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length < 5) {
            setOptions([...options, '']);
        }
    };

    const removeOption = (index) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question || options.some(opt => !opt)) {
            alert("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/polls', {
                question,
                options,
                token
            });
            onPollCreated(res.data);
            onClose();
        } catch (error) {
            alert("Failed to create poll");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cp-overlay">
            <div className="cp-modal">
                <div className="cp-header">
                    <h3>Create a Poll</h3>
                    <button className="cp-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="cp-field">
                        <label>Question</label>
                        <textarea 
                            placeholder="What would you like to ask?" 
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                        />
                    </div>

                    <div className="cp-field">
                        <label>Options</label>
                        {options.map((option, index) => (
                            <div key={index} className="cp-option-input">
                                <input 
                                    type="text" 
                                    placeholder={`Option ${index + 1}`}
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    required
                                />
                                {options.length > 2 && (
                                    <button type="button" onClick={() => removeOption(index)} className="cp-remove">✕</button>
                                )}
                            </div>
                        ))}
                        {options.length < 5 && (
                            <button type="button" onClick={addOption} className="cp-add-btn">+ Add Option</button>
                        )}
                    </div>

                    <div className="cp-actions">
                        <button type="button" onClick={onClose} className="cp-cancel">Cancel</button>
                        <button type="submit" className="cp-submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Poll'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePoll;
