const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.get("/", (req, res) => res.send("Socket.IO server running"));

// Listen for connections
io.on("connection", socket => {
  console.log("User connected:", socket.id);

  // Join a private room
  socket.on("join", room => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  // Handle messages in the room
  socket.on("message", data => {
    // data: { room: "room-name", text: "hi", id: socket.id }
    io.to(data.room).emit("message", data);
  });

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

server.listen(process.env.PORT || 3000, () => console.log("Server started"));
