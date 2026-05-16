const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: [{
        text: String,
        votes: {
            type: Number,
            default: 0
        }
    }],
    voters: [{
        type: String // rollNo of users who voted
    }],
    createdBy: {
        name: String,
        rollNo: String,
        image: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Poll', pollSchema);
