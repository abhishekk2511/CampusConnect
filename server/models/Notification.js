const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  type: { 
    type: String, 
    enum: ['friend_request', 'request_accepted', 'new_message'], 
    required: true 
  },
  content: { type: String, required: true },
  link: { type: String }, // e.g., '/dashboard?tab=network'
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
