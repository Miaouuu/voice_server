const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const RTCMultiConnectionServer = require("rtcmulticonnection-server");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passportJwtSocketIo = require("passport-jwt.socketio");

const app = express();
const serv = require("http").createServer(app);
const io = require("socket.io")(serv);

const auth = require("./routes/auth");
const user = require("./routes/user");
const server = require("./routes/server");
const channel = require("./routes/channel");

const options = {
  jwtFromRequest: ExtractJwt.fromUrlQueryParameter("token"),
  secretOrKey: "your_jwt_secret",
};

require("./passport");
require("dotenv").config();

mongoose.connect("mongodb://localhost:27017/voice", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", auth);
app.use("/api/user", passport.authenticate("jwt", { session: false }), user);
app.use(
  "/api/server",
  passport.authenticate("jwt", { session: false }),
  server
);
app.use(
  "/api/channel",
  passport.authenticate("jwt", { session: false }),
  channel
);

const Channel = require("./models/Channel");
const Message = require("./models/Message");

io.use(
  passportJwtSocketIo.authorize(options, (jwtPayload, done) => {
    return done(null, jwtPayload);
  })
);

io.on("connection", (socket) => {
  socket.on("MESSAGE", (msg) => {
    Channel.findOne(
      {
        _id: msg.channel,
        accesses: { $in: [socket.handshake.user._id] },
      },
      (err, raw) => {
        if (err) throw err;
        if (raw === null) {
        } else {
          let newMessage = new Message({
            text: msg.text,
            user: socket.handshake.user._id,
            channel: raw._id,
            updated: false,
          });
          newMessage.save((err) => {
            if (err) throw err;
            Channel.updateOne(
              { _id: raw._id },
              { $push: { messages: newMessage._id } },
              (err) => {
                if (err) throw err;
                io.emit("RES_MESSAGE", { _id: newMessage._id, text: msg.text });
              }
            );
          });
        }
      }
    );
  });
});

serv.listen(process.env.PORT, () => {
  console.log("Socket.IO server is running on " + process.env.PORT);
});
