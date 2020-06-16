const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  name: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  accesses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  channels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
  ],
  invitation: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Server = mongoose.model("Server", serverSchema);
