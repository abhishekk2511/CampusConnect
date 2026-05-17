const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const testProject = async () => {
    console.log("🚀 Starting API Integration Testing...\n");
    let testToken = "";
    const testRollNo = "13920803122"; // The admin user we set up
    const testPassword = "Abhishek@123";

    try {
        // 1. Test Signin
        console.log("Step 1: Testing Signin...");
        const signinRes = await axios.post(`${BASE_URL}/signin`, {
            rollNo: testRollNo,
            password: testPassword
        });
        testToken = signinRes.data.token;
        console.log("✅ Signin successful. Token acquired.\n");

        // 2. Test Get Profile
        console.log("Step 2: Testing Get Profile...");
        const profileRes = await axios.post(`${BASE_URL}/getprofile`, { token: testToken });
        console.log(`✅ Profile fetched for: ${profileRes.data.uploads.name}\n`);

        // 3. Test Polls
        console.log("Step 3: Testing Polls...");
        const pollsRes = await axios.get(`${BASE_URL}/polls`);
        console.log(`✅ Fetched ${pollsRes.data.length} polls.\n`);

        // 4. Test Jobs
        console.log("Step 4: Testing Jobs...");
        const jobsRes = await axios.get(`${BASE_URL}/jobs`);
        console.log(`✅ Fetched ${jobsRes.data.length} job opportunities.\n`);

        // 5. Test People Search
        console.log("Step 5: Testing People Search...");
        const searchRes = await axios.post(`${BASE_URL}/people/search`, { query: "Abhishek", token: testToken });
        console.log(`✅ Search returned ${searchRes.data.length} results.\n`);

        // 6. Test Admin Pending Verifications
        console.log("Step 6: Testing Admin Access...");
        const adminRes = await axios.get(`${BASE_URL}/admin/pending`);
        console.log(`✅ Admin access verified. ${adminRes.data.length} pending verifications found.\n`);

        console.log("🎊 ALL API TESTS PASSED SUCCESSFULLY! 🎊");
    } catch (error) {
        console.error("❌ TEST FAILED at some step:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(error.message);
        }
    }
};

testProject();
