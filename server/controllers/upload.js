const uploadpost = require('../models/upload');
const Profile = require('../models/Profile');
const jwt=require('jsonwebtoken');

exports.uploadImage = async (req, res) => {
    try {
        console.log("Upload POST request received");
        const { description, token, name } = req.body;
        
        if (!token) {
            console.error("Upload failed: No token provided");
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        console.log("Verifying token...");
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const rollNo = decoded.rollNo;
        console.log("Token verified for rollNo:", rollNo);

        const image = req.file ? req.file.filename : null;
        console.log("Creating post record with image:", image);

        const newpost = await uploadpost.create({
            description,
            image,
            name: name || "Anonymous",
            rollNo,
            createdAt: new Date()
        });
        
        console.log("Post created, linking to profile...");
        await Profile.findOneAndUpdate(
            { rollNo },
            { $push: { posts: newpost._id } }
        );
          
        // Emit real-time event
        const io = req.app.get('io');
        if (io) {
            io.emit('postCreated', newpost);
        }

        console.log("Upload successful!");
        res.status(200).json({
            success: true,
            newpost
        });
    } catch (err) {
        console.error("Upload error details:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUploads = async(req,res) => {
    try {
        const uploads = await uploadpost.aggregate([
            {
                $lookup: {
                    from: "profiles", // Name of the Profile collection in MongoDB
                    localField: "rollNo",
                    foreignField: "rollNo",
                    as: "authorProfile"
                }
            },
            {
                $addFields: {
                    authorImage: { $arrayElemAt: ["$authorProfile.image", 0] }
                }
            },
            {
                $project: {
                    authorProfile: 0 // Remove the intermediate array
                }
            },
            { $sort: { createdAt: -1 } }
        ]);      
        res.status(200).json(uploads);
    } catch(error) {
        console.error("getAllUploads error:", error);
        res.status(500).json({ error: error.message });
    }
}

exports.getmyUploads = async(req,res) => {
    try {
        const {rollNo} = req.body;
        const uploads = await uploadpost.aggregate([
            {
                $match: {
                    $or: [{ rollNo: rollNo }, { rollNo: String(rollNo) }]
                }
            },
            {
                $lookup: {
                    from: "profiles",
                    localField: "rollNo",
                    foreignField: "rollNo",
                    as: "authorProfile"
                }
            },
            {
                $addFields: {
                    authorImage: { $arrayElemAt: ["$authorProfile.image", 0] }
                }
            },
            {
                $project: {
                    authorProfile: 0
                }
            },
            { $sort: { createdAt: -1 } }
        ]);
        res.status(200).json(uploads);
    } catch(error) {
        res.status(500).json({ error: error.message });
    } 
}


// ── NEW: Comments and single post ──

exports.getPostById = async(req,res) => {
    try {
        const { postId } = req.params;
        const post = await uploadpost.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.addComment = async(req,res) => {
    try {
        const { postId, content, author, rollNo } = req.body;
        
        const updatedPost = await uploadpost.findByIdAndUpdate(
            postId, 
            { $push: { comments: { content, author, rollNo } } },
            { new: true }
        );
        
        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        // Emit real-time event
        const io = req.app.get('io');
        if (io) {
            io.emit('postUpdated', updatedPost);
        }
        
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// ── NEW: Likes ──

exports.likePost = async(req,res) => {
    try {
        const { id } = req.params; // postId
        const { token } = req.body; 
        let rollNo = req.body.rollNo;
        
        if (token) {
           const decoded = jwt.verify(token, process.env.SECRET_KEY);
           rollNo = decoded.rollNo;
        }

        const post = await uploadpost.findById(id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        // Toggle like functionality
        if (post.likes.includes(rollNo)) {
             // Unlike
             post.likes = post.likes.filter(r => r !== rollNo);
        } else {
             // Like
             post.likes.push(rollNo);
        }
        
        await post.save();

        // Emit real-time event
        const io = req.app.get('io');
        if (io) {
            io.emit('postUpdated', post);
        }

        res.status(200).json(post);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { token } = req.body;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const rollNo = decoded.rollNo;

        const post = await uploadpost.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if the user is the author of the post
        if (post.rollNo !== rollNo) {
            return res.status(403).json({ error: "Unauthorized: You can only delete your own posts" });
        }

        // Delete the post
        await uploadpost.findByIdAndDelete(postId);

        // Remove post from Profile collection
        await Profile.findOneAndUpdate(
            { rollNo },
            { $pull: { posts: postId } }
        );

        // Emit real-time event
        const io = req.app.get('io');
        if (io) {
            io.emit('postDeleted', postId);
        }

        res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        console.error("Delete post error:", error);
        res.status(500).json({ error: error.message });
    }
};
