const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 👇 ADD THIS ROUTE (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("Socket.IO server is running");
});

io.on("connection", socket => {
  console.log("User connected");

  socket.on("message", msg => {
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
