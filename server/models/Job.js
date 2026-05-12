const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    applyLink: {
        type: String,
        required: true,
    },
    postedBy: {
        name: String,
        rollNo: String,
        role: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Job", jobSchema);
