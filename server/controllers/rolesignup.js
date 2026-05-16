const Profile = require("../models/Profile");
const Rolesignup = require("../models/rolesignup");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookie = require("cookie-parser");
const OTP = require("../models/OTP");
const nodemailer = require("nodemailer");

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Need to set in .env
    pass: process.env.EMAIL_PASS || 'your-app-password'     // Need to set in .env
  }
});

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB (will expire in 5 mins due to TTL schema)
    await OTP.deleteMany({ email }); // Delete old OTPs for this email
    await OTP.create({ email, otp });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER || 'campusconnect@example.com',
      to: email,
      subject: 'CampusConnect - Email Verification OTP',
      html: `<h2>Your OTP for CampusConnect</h2>
             <p>Your OTP for email verification is: <strong>${otp}</strong></p>
             <p>This OTP is valid for 5 minutes.</p>`
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP sent to ${email}: ${otp}`); // For dev purposes
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (mailError) {
      console.error("Nodemailer error:", mailError);
      // Fallback: If SMTP fails (not configured), we still log it so dev can test
      console.log(`\n=== ⚠️ SMTP NOT CONFIGURED ===\nBut your OTP is: ${otp}\n==============================\n`);
      res.status(200).json({ message: "OTP generated (Check server console if email fails)" });
    }
  } catch (error) {
    console.error("OTP generation error:", error);
    res.status(500).json({ message: "Failed to generate OTP" });
  }
};

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
    const otp = req.body.otp;
    const image = req.file ? req.file.filename : "default.png";

    // Validate required fields
    if (!rollNo || !password || !name || !email || !year || !branch || !otp) {
      return res.status(400).json({ message: "All fields and OTP are required" });
    }

    // Verify OTP
    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
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

    // Delete the used OTP
    await OTP.deleteOne({ email });

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

    // AUTO-PROMOTE SPECIFIC USER TO ADMIN
    if (rollNo === "13920803122" && user.role !== "admin") {
        user.role = "admin";
        await user.save();
        console.log(`User ${rollNo} automatically promoted to admin.`);
    }
    //console.log(user._id);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ rollNo, role: user.role }, process.env.SECRET_KEY, { expiresIn: '12h' });
    res.status(200).json({ token, role: user.role });
    
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
   
  }
};
