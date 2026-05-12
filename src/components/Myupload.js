import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Image as ImageIcon, UploadCloud, X, ArrowLeft } from 'lucide-react';
import './Myupload.css';
import { useNavigate } from 'react-router-dom';

export const UploadForm = () => {
    const navigate = useNavigate();
    const storedToken = localStorage.getItem('token') || '';     
    const [token] = useState(storedToken);
    const fileInputRef = useRef(null);

    let userName = "Alumni/Student";
    const infoStore = localStorage.getItem('Info');
    if (infoStore) {
        try {
            const parsed = JSON.parse(infoStore);
            if(parsed && parsed.name) userName = parsed.name;
        } catch (e) {
            console.error("Error parsing user info:", e);
        }
    }

    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            alert('Please select a valid image file.');
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

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
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim() && !image) {
            alert("Please provide a description or an image to post.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('token', token);
        formData.append('description', description || "");
        if (image) formData.append('image', image);
        formData.append('date', new Date().toISOString());
        formData.append('name', userName);

        try {
            const res = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsSubmitting(false);
            alert("Post uploaded successfully! 🎉");
            navigate(-1);
        } catch (error) {
            console.error('Error uploading:', error);
            setIsSubmitting(false);
            const errorMsg = error.response?.data?.error || error.message;
            alert(`Failed to upload post: ${errorMsg}`);
        }
    };

    return (
        <div className="upload-page-wrapper">
            <div className="upload-card">
                
                <div className="upload-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2>Create New Post</h2>
                </div>

                <form className="upload-form" onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label>What's on your mind?</label>
                        <textarea 
                            value={description} 
                            onChange={handleDescriptionChange} 
                            placeholder={`Share your milestones, questions, or updates with the campus network, ${userName.split(' ')[0]}...`}
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label>Attach an Image (Optional)</label>
                        
                        {!previewUrl ? (
                            <div 
                                className={`drag-drop-zone ${isDragging ? 'dragging' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current.click()}
                            >
                                <div className="drop-zone-content">
                                    <div className="drop-icon-circle">
                                        <UploadCloud size={32} />
                                    </div>
                                    <h3>Click or drag & drop to upload</h3>
                                    <p>SVG, PNG, JPG or GIF (max. 5MB)</p>
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleImageChange} 
                                    accept="image/*"
                                    hidden
                                />
                            </div>
                        ) : (
                            <div className="image-preview-container">
                                <img src={previewUrl} alt="Preview" className="image-preview" />
                                <div className="preview-overlay">
                                    <button type="button" className="remove-image-btn" onClick={removeImage}>
                                        <X size={20} /> Remove Image
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => navigate(-1)} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn" disabled={isSubmitting || (!description.trim() && !image)}>
                            {isSubmitting ? (
                                <span className="loader-text">Uploading...</span>
                            ) : (
                                <>Publish Post ✨</>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};
