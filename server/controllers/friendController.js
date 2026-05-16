const Profile = require('../models/Profile');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');

// Helper to get current user's profile
const getMyProfile = async (token) => {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const rollNo = decoded.rollNo;
    return await Profile.findOne({ $or: [{ rollNo }, { rollNo: String(rollNo) }] });
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

        // Match both string and number forms of rollNo
        const targetProfile = await Profile.findOne({
            $or: [{ rollNo: targetRollNo }, { rollNo: String(targetRollNo) }]
        });

        if (!targetProfile) {
            return res.status(400).json({ message: "User not found" });
        }

        if (String(myProfile.rollNo) === String(targetRollNo)) {
            return res.status(400).json({ message: "Cannot send request to yourself" });
        }

        // Check if already friends
        if (myProfile.friends.map(id => id.toString()).includes(targetProfile._id.toString())) {
            return res.status(400).json({ message: "Already friends" });
        }

        // Check if request already sent
        if (myProfile.sentRequests.map(id => id.toString()).includes(targetProfile._id.toString())) {
            return res.status(400).json({ message: "Request already sent" });
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
        console.error("sendRequest error:", error.message);
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
        const myRollNo = decoded.rollNo;

        // Find profile matching either string or number rollNo
        const myProfile = await Profile.findOne({
            $or: [{ rollNo: myRollNo }, { rollNo: String(myRollNo) }]
        });

        const excludeIds = [];
        if (myProfile) {
            excludeIds.push(myProfile._id);
            (myProfile.friends || []).forEach(id => excludeIds.push(id));
            (myProfile.sentRequests || []).forEach(id => excludeIds.push(id));
        } else {
            // Profile doesn't exist yet — return empty gracefully
            return res.status(200).json([]);
        }

        const suggestions = await Profile.find({
            _id: { $nin: excludeIds }
        }).limit(8);

        res.status(200).json(suggestions);
    } catch (error) {
        console.error("Suggestions error:", error.message);
        // Return empty array instead of 500 to prevent frontend crash
        res.status(200).json([]);
    }
};
