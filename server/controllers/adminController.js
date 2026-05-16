const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');

// User requests verification
exports.requestVerification = async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const rollNo = decoded.rollNo;

        const verificationDoc = req.file ? req.file.filename : null;
        if (!verificationDoc) {
            return res.status(400).json({ message: "Verification document is required" });
        }

        const profile = await Profile.findOneAndUpdate(
            { rollNo },
            { 
                verificationStatus: 'pending',
                verificationDoc: verificationDoc
            },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Verification request submitted", profile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin gets all pending requests
exports.getPendingVerifications = async (req, res) => {
    try {
        // In a real app, you'd check if req.user.role === 'admin'
        const pending = await Profile.find({ verificationStatus: 'pending' });
        res.status(200).json(pending);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin approves/rejects verification
exports.handleVerification = async (req, res) => {
    try {
        const { userId, status } = req.body; // status: 'verified' or 'rejected'
        
        const updateData = { verificationStatus: status };
        if (status === 'verified') {
            updateData.isVerified = true;
        } else {
            updateData.isVerified = false;
        }

        const profile = await Profile.findByIdAndUpdate(userId, updateData, { new: true });
        
        res.status(200).json({ success: true, message: `User ${status}`, profile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
