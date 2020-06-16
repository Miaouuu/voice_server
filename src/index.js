const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const RTCMultiConnectionServer = require("rtcmulticonnection-server");

const app = express();
const serv = require("http").createServer(app);
const io = require("socket.io")(serv);

const auth = require("./routes/auth");
const user = require("./routes/user");
const server = require("./routes/server");
const channel = require("./routes/channel");

require("./passport");
require("dotenv").config();

mongoose.connect("mongodb://localhost:27017/voice", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

io.on("connection", (socket) => {
  RTCMultiConnectionServer.addSocket(socket);
});

serv.listen(process.env.PORT, () => {
  console.log("Socket.IO server is running on " + process.env.PORT);
});
