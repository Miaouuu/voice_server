const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const RTCMultiConnectionServer = require("rtcmulticonnection-server");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const auth = require("./routes/auth");
const user = require("./routes/user");

require("./passport");
require("dotenv").config();

mongoose.connect("mongodb://localhost:27017/voice", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.use("/auth", auth);
app.use("/user", passport.authenticate("jwt", { session: false }), user);

io.on("connection", (socket) => {
  RTCMultiConnectionServer.addSocket(socket);
});

server.listen(process.env.PORT, () => {
  console.log("Socket.IO server is running on " + process.env.PORT);
});
