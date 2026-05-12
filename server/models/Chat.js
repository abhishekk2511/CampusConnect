const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      read: { type: Boolean, default: false }
    }
  ],
  lastMessage: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
