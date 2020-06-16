const express = require("express");
const router = express.Router();

const Server = require("../models/Server");
const User = require("../models/User");

const PIN_LENGTH = 4;

const createPin = async () => {
  const characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  let pin = "";
  for (let i = 0; i < PIN_LENGTH; i++) {
    pin += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  let exist = (await Server.findOne({ invitation: pin })) !== null;
  return exist ? await createPin() : pin;
};

router.get("/:id", (req, res) => {
  Server.findById(req.params.id)
    .populate("channels")
    .exec((err, data) => {
      if (err) throw err;
      if (data === null) {
        res.send({ message: "The server doesn't exist !" });
      } else {
        res.send(data);
      }
    });
});

router.post("/", async (req, res) => {
  let pin = await createPin();
  let newServer = new Server({
    name: req.body.name,
    creator: req.user._id,
    accesses: [req.user._id],
    channels: [],
    invitation: pin,
  });
  newServer.save((err) => {
    if (err) throw err;
    User.updateOne(
      { _id: req.user._id },
      { $push: { servers: newServer._id } },
      (err) => {
        if (err) throw err;
        res.send(newServer);
      }
    );
  });
});

router.post("/join/:invitation", (req, res) => {
  Server.findOne({ invitation: req.params.invitation }, (err, data) => {
    if (err) throw err;
    if (data === null)
      return res.send({ message: "The server doesn't exist !" });
    User.findOne(
      {
        _id: req.user._id,
        servers: { $in: [data._id] },
      },
      (err, raw) => {
        if (err) throw err;
        if (raw === null) {
          User.updateOne(
            { _id: req.user._id },
            {
              $push: { servers: data._id },
            },
            (err) => {
              if (err) throw err;
              Server.updateOne(
                { invitation: req.params.invitation },
                {
                  $push: { accesses: req.user._id },
                },
                (err) => {
                  if (err) throw err;
                  res.send({ message: "You joined the server" });
                }
              );
            }
          );
        } else {
          res.send({ message: "You already joined the server !" });
        }
      }
    );
  });
});

module.exports = router;
