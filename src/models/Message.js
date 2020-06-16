const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updated: Boolean,
});

module.exports = Message = mongoose.model("Message", messageSchema);
