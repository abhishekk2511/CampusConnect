const mongoose = require('mongoose');
const Rolesignup = require('./models/rolesignup');
require('dotenv').config();

const uri = process.env.DB;

async function checkUsers() {
    try {
        await mongoose.connect(uri);
        console.log("--- USERS ---");
        const users = await Rolesignup.find().limit(10);
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
