const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Rolesignup = require('../models/rolesignup');

async function checkUsers() {
    try {
        const uri = process.env.DB;
        await mongoose.connect(uri);
        console.log("Connected to DB");
        const all = await Rolesignup.find({});
        console.log("Total Users (Rolesignup):", all.length);
        all.forEach(u => {
            console.log(`RollNo: ${u.rollNo}, Role: ${u.role}`);
        });
        process.exit();
    } catch (e) {
        console.error("Error:", e.message);
        process.exit(1);
    }   
}

checkUsers();
