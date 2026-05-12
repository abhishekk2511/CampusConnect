const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Controllers
const { rolesignup, rolesignin } = require("../controllers/rolesignup");
const { uploadImage, getAllUploads, getmyUploads, getPostById, addComment, likePost } = require("../controllers/upload");
const { setprofile, getprofile, editprofile, getotherprofile } = require("../controllers/setprofile");
const { messages } = require("../controllers/messages");
const { myprofile } = require("../controllers/myprofile");
const { analyzeResume } = require("../controllers/resumeAnalyzer");
const { createJob, getAllJobs } = require("../controllers/jobController");
const { getAlumniLocations } = require("../controllers/mapController");
const { createReferral, getReferrals, updateReferralStatus } = require("../controllers/referralController");
const { handleChat } = require("../controllers/chatController");

// ================= FILE STORAGE =================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ================= ROUTES =================

// Auth Routes (MongoDB based)
router.post("/api/signup", upload.single("image"), rolesignup);
router.post("/api/signin", rolesignin);

// Profile Routes
router.post("/api/setprofile", upload.single("setimage"), setprofile);
router.post("/api/getprofile", getprofile);
router.post("/api/getotherprofile", getotherprofile);
router.post("/api/editprofile", upload.single("setimage"), editprofile);
router.post("/api/myprofile", myprofile);

// Uploads / Posts Routes
router.post("/api/upload", upload.single("image"), uploadImage);
router.get("/api/alluploads", getAllUploads);
router.post("/api/myuploads", getmyUploads);

// Posts interactions (Comments & Likes)
router.get("/api/posts/:postId", getPostById);
router.post("/api/comments", addComment);
router.post("/api/posts/:id/likes", likePost);

// Messages Route
router.post("/api/message", messages);

// Resume Analyzer
router.post("/api/analyze-resume", upload.single("resume"), analyzeResume);

// Jobs Route
router.get("/api/jobs", getAllJobs);
router.post("/api/jobs", createJob);

// Map Route
router.get("/api/alumni-locations", getAlumniLocations);

// Referrals Route
router.post("/api/referrals", createReferral);
router.get("/api/referrals/:rollNo", getReferrals);
router.put("/api/referrals/:id/status", updateReferralStatus);

// Chat Route
router.post("/api/chat", handleChat);
router.post("/api/private/conversations", require("../controllers/chatController").getConversations);
router.post("/api/private/send", require("../controllers/chatController").sendMessage);
router.post("/api/private/messages", require("../controllers/chatController").getMessages);

// Friend & Search Routes
const friendCtrl = require("../controllers/friendController");
router.post("/api/people/search", friendCtrl.searchPeople);
router.post("/api/friends/request", friendCtrl.sendRequest);
router.post("/api/friends/get-requests", friendCtrl.getRequests);
router.post("/api/friends/handle-request", friendCtrl.handleRequest);
router.post("/api/friends/list", friendCtrl.getFriends);
router.post("/api/people/suggestions", friendCtrl.getSuggestions);

// Notification Routes
const notifCtrl = require("../controllers/notificationController");
router.post("/api/notifications/get", notifCtrl.getNotifications);
router.post("/api/notifications/mark-read", notifCtrl.markAsRead);
router.post("/api/notifications/mark-all-read", notifCtrl.markAllAsRead);

module.exports = router;