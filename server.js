const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// Optional route
app.get("/", (req, res) => res.send("Socket.IO server running"));

// Temporary message storage per room
const roomsHistory = {};

io.on("connection", socket => {
  console.log("User connected:", socket.id);

  // Join a room
  socket.on("join", room => {
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);

    // Send existing room history to the newly connected socket
    if (roomsHistory[room]) {
      roomsHistory[room].forEach(msg => socket.emit("message", msg));
    }
  });

  // Receive a message from a client
  socket.on("message", data => {
    // data: { room, text, id, ts }

    // Save to room history
    if (!roomsHistory[data.room]) roomsHistory[data.room] = [];
    roomsHistory[data.room].push(data);
    if (roomsHistory[data.room].length > 200) roomsHistory[data.room].shift();

    // Broadcast to everyone in room EXCEPT sender
    socket.to(data.room).emit("message", data);
  });

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

server.listen(process.env.PORT || 3000, () => console.log("Server started"));
