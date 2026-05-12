const Chat = require('../models/Chat');
const Profile = require('../models/Profile');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');

const getMyProfile = async (token) => {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return await Profile.findOne({ rollNo: decoded.rollNo });
};

// Existing AI Bot logic
exports.handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });
        const msgLower = message.toLowerCase();
        let botResponse = "";
        if (msgLower.includes("resume")) botResponse = "Use our Resume Analyzer tab for instant feedback!";
        else if (msgLower.includes("job")) botResponse = "Check the Job Board for openings!";
        else if (msgLower.includes("hi")) botResponse = "Hello! I'm the IPU Alumni AI. How can I help?";
        else botResponse = "I'm here to help with your career and alumni networking!";
        
        setTimeout(() => res.status(200).json({ response: botResponse }), 1000);
    } catch (err) {
        res.status(500).json({ error: "Bot error" });
    }
};

// Private Messaging Logic
exports.getConversations = async (req, res) => {
    try {
        const { token } = req.body;
        const myProfile = await getMyProfile(token);
        const chats = await Chat.find({
            participants: myProfile._id
        }).populate('participants', 'name rollNo image branch jobTitle');
        
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: "Failed to get conversations" });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { token, receiverId, text } = req.body;
        const myProfile = await getMyProfile(token);

        let chat = await Chat.findOne({
            participants: { $all: [myProfile._id, receiverId] }
        });

        if (!chat) {
            chat = await Chat.create({
                participants: [myProfile._id, receiverId],
                messages: []
            });
        }

        chat.messages.push({
            sender: myProfile._id,
            text
        });
        chat.lastMessage = Date.now();
        await chat.save();

        // Create Notification for the receiver
        await Notification.create({
            recipient: receiverId,
            sender: myProfile._id,
            type: 'new_message',
            content: `New message from ${myProfile.name}`,
            link: 'messages'
        });

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: "Failed to send message" });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { token, otherUserId } = req.body;
        const myProfile = await getMyProfile(token);
        const chat = await Chat.findOne({
            participants: { $all: [myProfile._id, otherUserId] }
        }).populate('messages.sender', 'name');
        
        res.status(200).json(chat ? chat.messages : []);
    } catch (error) {
        res.status(500).json({ message: "Failed to get messages" });
    }
};
