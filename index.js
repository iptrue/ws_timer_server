const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
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
      if (value > 3) {
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

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
