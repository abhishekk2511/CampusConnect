const Profile = require("../models/Profile");
const Rolesignup = require("../models/rolesignup");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookie = require("cookie-parser");
exports.rolesignup = async (req, res) => {
  let registerstudent = null;
  try {
    const role = req.body.role;
    const rollNo = req.body.rollNo;
    const password = req.body.password;
    
    // Profile details
    const name = req.body.name;
    const branch = req.body.branch;
    const year = req.body.year;
    const email = req.body.email;
    const company = req.body.company || "";
    const jobTitle = req.body.jobTitle || "";
    const image = req.file ? req.file.filename : "default.png";

    // Validate required fields
    if (!rollNo || !password || !name || !email || !year || !branch) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Rolesignup.findOne({ rollNo });
    if (existingUser) {
      return res.status(400).json({ message: "This Roll Number is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 1: Create auth record
    registerstudent = await Rolesignup.create({
      role,
      rollNo,
      password: hashedPassword,
    });

    // Step 2: Create Profile — if this fails, rollback auth record
    await Profile.create({
      name,
      branch,
      year: String(year),
      email,
      rollNo: String(rollNo),
      image,
      company,
      jobTitle
    });

    res.status(200).json({ message: "Account created successfully!" });

  } catch (err) {
    console.error("Signup error:", err);
    // Rollback: delete auth record if profile creation failed
    if (registerstudent) {
      await Rolesignup.deleteOne({ _id: registerstudent._id }).catch(() => {});
    }
    res.status(500).json({ message: "Signup failed. Please try again.", error: err.message });
  }
};

exports.rolesignin = async (req, res) => {
  try {
  

    const rollNo = req.body.rollNo;
    const password = req.body.password;
     
  
    const user = await Rolesignup.findOne({ rollNo });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    //console.log(user._id);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({rollNo }, process.env.SECRET_KEY, { expiresIn: '12h' });
    res.status(200)
      .json(token);
    
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
   
  }
};
