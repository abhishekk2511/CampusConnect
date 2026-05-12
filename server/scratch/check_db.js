const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Profile = require('../models/Profile');

async function checkProfiles() {
    try {
        const uri = process.env.DB;
        console.log("Connecting to:", uri);
        await mongoose.connect(uri);
        console.log("Connected to DB");
        const all = await Profile.find({});
        console.log("Total Profiles:", all.length);
        all.forEach(p => {
            console.log(`Name: "${p.name}", RollNo: ${p.rollNo}`);
        });
        process.exit();
    } catch (e) {
        console.error("Error:", e.message);
        process.exit(1);
    }
}

checkProfiles();
