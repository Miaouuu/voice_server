const express = require("express");
const router = express.Router();

const Channel = require("../models/Channel");
const Server = require("../models/Server");

router.get("/:id", (req, res) => {
  Server.findById(req.params.id, (err, data) => {
    if (err) throw err;
    if (data === null) {
      res.send({ message: "The server doesn't exist !" });
    } else {
      res.send(data);
    }
  });
});

module.exports = router;
