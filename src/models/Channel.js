const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  name: String,
  type: {
    type: String,
    enum: ["TEXT", "VOICE", "BOTH"],
    default: "TEXT",
  },
  accesses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  server: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Server",
  },
});

module.exports = Channel = mongoose.model("Channel", channelSchema);
