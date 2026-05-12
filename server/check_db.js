const mongoose = require('mongoose');
const Upload = require('./models/upload');
const Profile = require('./models/Profile');
require('dotenv').config();

const uri = process.env.DB;

async function checkData() {
    try {
        console.log("Connecting to:", uri);
        await mongoose.connect(uri);
        console.log("--- LATEST UPLOADS ---");
        const uploads = await Upload.find().sort({ _id: -1 }).limit(5);
        console.log(JSON.stringify(uploads, null, 2));

        console.log("\n--- LATEST PROFILES ---");
        const profiles = await Profile.find().sort({ _id: -1 }).limit(5);
        console.log(JSON.stringify(profiles, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
