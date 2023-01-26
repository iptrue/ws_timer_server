const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

app.use(cors());
const port = process.env.REACT_CLIENT || "http://localhost:3000";
const runPort = process.env.PORT || 3001;
const server = http.createServer(app);
app.get("/test", function (req, res) {
  res.send("hello world");
});
console.log(port);
const io = new Server(server, {
  cors: {
    origin: port,
    methods: ["GET", "POST"],
  },
});
let value = 0;
let userNum = 0;
let isConnected = false;
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  if (!isConnected) {
    setInterval(() => {
      console.log(value);
      io.emit("receive_message", value, userNum);
      value = value + 1;
      if (value > 120) {
        value = 0;
        userNum = userNum + 1;
        if (userNum > 4) {
          userNum = 0;
        }
      }
    }, 1000);
  }
  isConnected = true;
});

server.listen(runPort, () => {
  console.log("servers cors origin is ", port);
  console.log("SERVER IS RUNNING on port", runPort);
});
