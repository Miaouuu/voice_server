const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const RTCMultiConnectionServer = require("rtcmulticonnection-server");

io.on("connection", (socket) => {
  RTCMultiConnectionServer.addSocket(socket);
});

server.listen(3001, () => {
  console.log("Socket.IO server is running on localhost:3001");
});
