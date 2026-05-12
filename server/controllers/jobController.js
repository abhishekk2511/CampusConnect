const Job = require('../models/Job');
const jwt = require('jsonwebtoken');

exports.createJob = async (req, res) => {
    try {
        const { title, company, location, type, description, applyLink, token } = req.body;
        
        let postedBy = { name: "Unknown", rollNo: "Unknown", role: "alumni" };
        
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                postedBy.rollNo = decoded.rollNo;
                // Since name and role aren't always in token, we will just pass them from frontend if possible
                // or retrieve them from the DB. For simplicity, we use the frontend provided values if available
                if(req.body.name) postedBy.name = req.body.name;
                if(req.body.role) postedBy.role = req.body.role;
            } catch(e) {
                console.log("Invalid token for posting job");
            }
        } else {
             // Mock fallback if token verification not used strictly here
             postedBy.name = req.body.name || "Alumni User";
             postedBy.rollNo = req.body.rollNo || "Unknown";
             postedBy.role = req.body.role || "alumni";
        }

        const newJob = await Job.create({
            title,
            company,
            location,
            type,
            description,
            applyLink,
            postedBy
        });
        
        res.status(201).json(newJob);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });      
        res.status(200).json(jobs);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
};
