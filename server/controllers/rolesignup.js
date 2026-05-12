const Profile = require("../models/Profile");
const Rolesignup = require("../models/rolesignup");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookie = require("cookie-parser");
exports.rolesignup = async (req, res) => {
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

    const existingUser = await Rolesignup.findOne({ rollNo });
    
    if (existingUser != null) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const registerstudent = await Rolesignup.create({
      role,
      rollNo,
      password: hashedPassword,
    });

    // Create the Profile immediately
    await Profile.create({
      name,
      branch,
      year,
      email,
      rollNo,
      image,
      company,
      jobTitle
    });

    res.status(200).json({
      message: "sucs ",
    });

  } catch (err) {
    console.log(err, "err from backened", err);
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
