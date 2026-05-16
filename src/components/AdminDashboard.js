import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/pending');
            setPendingUsers(res.data);
        } catch (error) {
            console.error("Error fetching pending verifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleAction = async (userId, status) => {
        try {
            await axios.post('http://localhost:5000/api/admin/handle-verify', { userId, status });
            alert(`User ${status} successfully`);
            fetchPending();
        } catch (error) {
            alert("Action failed");
        }
    };

    if (loading) return <div className="admin-loading">Loading pending requests...</div>;

    return (
        <div className="admin-dashboard">
            <h2>Admin Verification Dashboard</h2>
            <p>Review documents and verify alumni status.</p>
            
            <div className="admin-table-container">
                {pendingUsers.length === 0 ? (
                    <div className="admin-empty">No pending verification requests.</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Roll No</th>
                                <th>Branch</th>
                                <th>Document</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingUsers.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.rollNo}</td>
                                    <td>{user.branch}</td>
                                    <td>
                                        <a 
                                            href={`http://localhost:5000/uploads/${user.verificationDoc}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="admin-view-doc"
                                        >
                                            View Document
                                        </a>
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            <button 
                                                className="admin-btn-approve"
                                                onClick={() => handleAction(user._id, 'verified')}
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                className="admin-btn-reject"
                                                onClick={() => handleAction(user._id, 'rejected')}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
