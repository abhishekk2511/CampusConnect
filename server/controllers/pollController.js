const Poll = require('../models/Poll');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');

exports.createPoll = async (req, res) => {
    try {
        const { question, options, token } = req.body;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const rollNo = decoded.rollNo;

        const user = await Profile.findOne({ rollNo });
        
        const formattedOptions = options.map(opt => ({ text: opt, votes: 0 }));

        const newPoll = await Poll.create({
            question,
            options: formattedOptions,
            createdBy: {
                name: user.name,
                rollNo: user.rollNo,
                image: user.image
            }
        });

        res.status(201).json(newPoll);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllPolls = async (req, res) => {
    try {
        const polls = await Poll.find().sort({ createdAt: -1 });
        res.status(200).json(polls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.votePoll = async (req, res) => {
    try {
        const { pollId, optionIndex, token } = req.body;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const rollNo = decoded.rollNo;

        const poll = await Poll.findById(pollId);
        if (!poll) return res.status(404).json({ message: "Poll not found" });

        if (poll.voters.includes(rollNo)) {
            return res.status(400).json({ message: "You have already voted on this poll" });
        }

        poll.options[optionIndex].votes += 1;
        poll.voters.push(rollNo);
        await poll.save();

        res.status(200).json(poll);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
