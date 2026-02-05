const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.get("/", (req, res) => res.send("Socket.IO server running"));

// Optional temporary in-memory history (keeps messages while server runs)
const messagesHistory = {};

io.on("connection", socket => {
  console.log("User connected:", socket.id);

  socket.on("join", room => {
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);

    // send history for this room (if any)
    if (messagesHistory[room]) {
      messagesHistory[room].forEach(msg => socket.emit("message", msg));
    }
  });

  // Receive message and broadcast to others in the same room (exclude sender)
  socket.on("message", data => {
    // data: { room, text, id, ts? }
    // store in history (optional)
    if (!messagesHistory[data.room]) messagesHistory[data.room] = [];
    messagesHistory[data.room].push(data);
    // Keep history bounded (avoid infinite memory)
    if (messagesHistory[data.room].length > 200) messagesHistory[data.room].shift();

    // broadcast to everyone in room EXCEPT the sender
    socket.to(data.room).emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(process.env.PORT || 3000, () => console.log("Server started"));
