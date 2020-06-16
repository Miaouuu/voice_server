const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  servers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Server",
    },
  ],
});

module.exports = User = mongoose.model("User", userSchema);
