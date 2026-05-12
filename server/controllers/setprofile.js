const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');
const uploadpost=require('../models/upload');

exports.setprofile = async (req, res) => {
    try {
      console.log('set profile called');
      const { name, branch, year, storedtoken, email, company, jobTitle } = req.body;
      const decoded = jwt.verify(storedtoken, process.env.SECRET_KEY);
      const rollNo = decoded.rollNo;

      const setimage = req.file ? req.file.filename : null;
      console.log("Setting profile for rollNo:", rollNo);

      // Use findOneAndUpdate with upsert to prevent duplicates
      const profile = await Profile.findOneAndUpdate(
        { rollNo },
        {
          name,
          branch,
          year,
          rollNo,
          email,
          ...(setimage && { image: setimage }), // Only update image if new one uploaded
          company: company || "",
          jobTitle: jobTitle || ""
        },
        { upsert: true, new: true }
      );

      res.status(200).json({ message: "success", profile });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "error during setprofile", error: error.message });
    }
  };
exports.getprofile=async(req,res)=>{
try{
    const {token}=req.body;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const rollNo = decoded.rollNo;

    console.log("get profile called for rollNo:", rollNo);
    
    // Find the profile
    const profile = await Profile.findOne({ 
      $or: [{ rollNo: rollNo }, { rollNo: String(rollNo) }]
    });

    if(!profile){
      return res.json({ message: "Enter details" });
    }

    // DIRECT FETCH: Find all posts for this rollNo directly from Upload collection
    // This is much more reliable than relying on the profile.posts array
    const posts = await uploadpost.find({ 
      $or: [{ rollNo: rollNo }, { rollNo: String(rollNo) }] 
    }).sort({ _id: -1 });
    
    // Merge posts into the response object
    const profileData = profile.toObject();
    profileData.posts = posts;

    res.status(200).json({message:"suceess", uploads: profileData});
}
catch(err){
    console.error("getprofile error:", err);
    res.status(400).json({ message:"error", error: err.message });
}
}
exports.getotherprofile=async(req,res)=>{
  try{
      const {rollNo}=req.body;
      console.log("get otherprofile called for rollNo:", rollNo);

      // Find the profile
      const profile = await Profile.findOne({ 
        $or: [{ rollNo: rollNo }, { rollNo: String(rollNo) }]
      });

      if(!profile){
        return res.json({ message: "Enter details" });
      }

      // Find posts directly
      const posts = await uploadpost.find({ 
        $or: [{ rollNo: rollNo }, { rollNo: String(rollNo) }] 
      }).sort({ _id: -1 });

      const profileData = profile.toObject();
      profileData.posts = posts;

      res.status(200).json({message:"suceess", uploads: profileData});
  }
  catch(err){
      console.error("getotherprofile error:", err);
      res.status(400).json({ message:"error", error: err.message });
  }
}
exports.editprofile = async (req, res) => {
    try {
        const { name, year, branch, company, jobTitle, token } = req.body;
        console.log("Edit profile called for token", token);

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const rollNo = decoded.rollNo;

        const updateData = {
            name,
            year,
            branch,
            company: company || "",
            jobTitle: jobTitle || ""
        };

        // If a new image was uploaded
        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updatedProfile = await Profile.findOneAndUpdate(
            { rollNo: rollNo },
            updateData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile: updatedProfile
        });

    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
};