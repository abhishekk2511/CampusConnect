const mongoose = require('mongoose');
const Upload = require('./server/models/upload');
const Profile = require('./server/models/Profile');

const uri = 'mongodb+srv://abhishek9116:abhishek9116@alumni.juzp1.mongodb.net/Alumni?retryWrites=true&w=majority';

async function checkData() {
    try {
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
