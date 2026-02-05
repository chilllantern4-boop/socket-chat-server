const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// Route to check server
app.get("/", (req, res) => res.send("Socket.IO server running"));

// Broadcast messages
io.on("connection", socket => {
  console.log("User connected");

  socket.on("message", msg => {
    io.emit("message", msg); // broadcast to all clients
  });

  socket.on("disconnect", () => console.log("User disconnected"));
});

  socket.on("disconnect", () => console.log("User disconnected"));
});

server.listen(process.env.PORT || 3000, () => console.log("Server started"));
