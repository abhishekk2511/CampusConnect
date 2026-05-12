const Referral = require('../models/Referral');
const jwt = require('jsonwebtoken');

exports.createReferral = async (req, res) => {
    try {
        const { jobId, jobTitle, company, receiverRollNo, pitch, resumeLink, token } = req.body;
        
        let requesterName = req.body.requesterName || "Student User";
        let requesterRollNo = req.body.requesterRollNo || "Unknown";

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                requesterRollNo = decoded.rollNo;
            } catch(e) {
                console.log("Invalid token for creating referral");
            }
        }

        const newReferral = await Referral.create({
            jobId,
            jobTitle,
            company,
            requesterName,
            requesterRollNo,
            receiverRollNo,
            pitch,
            resumeLink
        });
        
        res.status(201).json(newReferral);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.getReferrals = async (req, res) => {
    try {
        const { rollNo } = req.params;
        
        // Incoming requests: where the current user is the receiver
        const incoming = await Referral.find({ receiverRollNo: rollNo }).sort({ createdAt: -1 });
        
        // Outgoing requests: where the current user is the requester
        const outgoing = await Referral.find({ requesterRollNo: rollNo }).sort({ createdAt: -1 });
        
        res.status(200).json({ incoming, outgoing });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateReferralStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Approved' or 'Declined'
        
        const referral = await Referral.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        
        if (!referral) {
            return res.status(404).json({ error: "Referral request not found" });
        }
        
        res.status(200).json(referral);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
