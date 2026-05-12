const Profile = require('../models/Profile');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');

// Helper to get current user's profile
const getMyProfile = async (token) => {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return await Profile.findOne({ rollNo: decoded.rollNo });
};

exports.searchPeople = async (req, res) => {
    try {
        const { query } = req.body;
        console.log("Searching for:", query);
        
        // Use $expr to convert numeric rollNo to string for partial matching
        // Also include a direct numeric match if the query is a valid number
        const numQuery = Number(query);
        const searchConditions = [
            { name: { $regex: query, $options: 'i' } },
            { 
                $expr: { 
                    $regexMatch: { 
                        input: { $toString: "$rollNo" }, 
                        regex: query, 
                        options: "i" 
                    } 
                } 
            }
        ];

        if (!isNaN(numQuery)) {
            searchConditions.push({ rollNo: numQuery });
        }

        const people = await Profile.find({
            $or: searchConditions
        }).limit(10);
        console.log("Found:", people.length, "people");
        res.status(200).json(people);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Search failed" });
    }
};

exports.sendRequest = async (req, res) => {
    try {
        const { token, targetRollNo } = req.body;
        const myProfile = await getMyProfile(token);
        
        if (!myProfile) {
            return res.status(400).json({ message: "Please complete your profile first!" });
        }

        const targetProfile = await Profile.findOne({ rollNo: targetRollNo });

        if (!targetProfile || myProfile.rollNo === targetRollNo) {
            return res.status(400).json({ message: "Invalid target" });
        }

        // Check if already friends or request pending
        if (myProfile.friends.includes(targetProfile._id)) {
            return res.status(400).json({ message: "Already friends" });
        }

        // Add to target's friendRequests
        targetProfile.friendRequests.push({ from: myProfile._id });
        await targetProfile.save();

        // Add to my sentRequests
        myProfile.sentRequests.push(targetProfile._id);
        await myProfile.save();

        // Create Notification
        await Notification.create({
            recipient: targetProfile._id,
            sender: myProfile._id,
            type: 'friend_request',
            content: `${myProfile.name} sent you a friend request.`,
            link: 'network'
        });

        res.status(200).json({ message: "Request sent" });
    } catch (error) {
        res.status(500).json({ message: "Failed to send request" });
    }
};

exports.getRequests = async (req, res) => {
    try {
        const { token } = req.body;
        const profile = await getMyProfile(token);
        const fullProfile = await Profile.findById(profile._id).populate('friendRequests.from', 'name rollNo branch image');
        res.status(200).json(fullProfile.friendRequests);
    } catch (error) {
        res.status(500).json({ message: "Failed to get requests" });
    }
};

exports.handleRequest = async (req, res) => {
    try {
        const { token, requestId, action } = req.body; // action: 'accept' or 'reject'
        const myProfile = await getMyProfile(token);

        const requestIndex = myProfile.friendRequests.findIndex(r => r._id.toString() === requestId);
        if (requestIndex === -1) return res.status(404).json({ message: "Request not found" });

        const targetId = myProfile.friendRequests[requestIndex].from;

        if (action === 'accept') {
            myProfile.friends.push(targetId);
            const targetProfile = await Profile.findById(targetId);
            targetProfile.friends.push(myProfile._id);
            await targetProfile.save();

            // Create Notification for the person who sent the request
            await Notification.create({
                recipient: targetId,
                sender: myProfile._id,
                type: 'request_accepted',
                content: `${myProfile.name} accepted your friend request!`,
                link: 'network'
            });
        }

        // Remove from friendRequests
        myProfile.friendRequests.splice(requestIndex, 1);
        await myProfile.save();

        res.status(200).json({ message: `Request ${action}ed` });
    } catch (error) {
        res.status(500).json({ message: "Action failed" });
    }
};

exports.getFriends = async (req, res) => {
    try {
        const { token } = req.body;
        const profile = await getMyProfile(token);
        const fullProfile = await Profile.findById(profile._id).populate('friends', 'name rollNo branch image jobTitle company');
        res.status(200).json(fullProfile.friends);
    } catch (error) {
        res.status(500).json({ message: "Failed to get friends" });
    }
};

exports.getSuggestions = async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const myRollNo = Number(decoded.rollNo);
        
        const myProfile = await Profile.findOne({ rollNo: myRollNo });
        const excludeIds = [];
        
        if (myProfile) {
            excludeIds.push(myProfile._id);
            // Optional: still exclude friends for better UX
            (myProfile.friends || []).forEach(id => excludeIds.push(id));
            (myProfile.sentRequests || []).forEach(id => excludeIds.push(id));
        } else {
            // Just find any profile with this rollNo to exclude
            const temp = await Profile.findOne({ rollNo: myRollNo });
            if (temp) excludeIds.push(temp._id);
        }

        // Find anyone NOT in the exclude list
        const suggestions = await Profile.find({
            _id: { $nin: excludeIds }
        }).limit(8);

        res.status(200).json(suggestions);
    } catch (error) {
        console.error("Debug suggestions error:", error);
        res.status(500).json({ message: "Error" });
    }
};
