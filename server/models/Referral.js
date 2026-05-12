const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
    jobId: {
        type: String, // String instead of ObjectId to support mock job IDs and real IDs
        required: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    requesterName: {
        type: String,
        required: true,
    },
    requesterRollNo: {
        type: String,
        required: true,
    },
    receiverRollNo: {
        type: String,
        required: true,
    },
    pitch: {
        type: String,
        required: true,
    },
    resumeLink: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Declined'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Referral", referralSchema);
