const Notification = require('../models/Notification');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');

const getMyProfile = async (token) => {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const rollNo = decoded.rollNo;
    return await Profile.findOne({ $or: [{ rollNo }, { rollNo: String(rollNo) }] });
};

exports.getNotifications = async (req, res) => {
    try {
        const { token } = req.body;
        const myProfile = await getMyProfile(token);
        if (!myProfile) return res.status(200).json([]); // graceful empty response
        const notifications = await Notification.find({ recipient: myProfile._id })
            .populate('sender', 'name image')
            .sort({ createdAt: -1 })
            .limit(20);
        
        res.status(200).json(notifications);
    } catch (error) {
        console.error("getNotifications error:", error.message);
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { token, notificationId } = req.body;
        await Notification.findByIdAndUpdate(notificationId, { read: true });
        res.status(200).json({ message: "Marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const { token } = req.body;
        const myProfile = await getMyProfile(token);
        await Notification.updateMany({ recipient: myProfile._id, read: false }, { read: true });
        res.status(200).json({ message: "All marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};
