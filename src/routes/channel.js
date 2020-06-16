const express = require("express");
const router = express.Router();

const Channel = require("../models/Channel");
const Server = require("../models/Server");

router.get("/:id", (req, res) => {
  Channel.findById(req.params.id)
    .populate("messages")
    .exec((err, raw) => {
      if (err) throw err;
      res.send(raw);
    });
});

router.post("/", (req, res) => {
  let newChannel = new Channel({
    name: req.body.name,
    type: req.body.type,
    accesses: [req.user._id],
    server: req.body.server,
    messages: [],
  });
  newChannel.save((err) => {
    if (err) throw err;
    Server.findOneAndUpdate(
      { _id: req.body.server },
      { $push: { channels: newChannel._id } }
    )
      .populate("channels")
      .exec((err, raw) => {
        if (err) throw err;
        res.send(raw);
      });
  });
});

module.exports = router;
