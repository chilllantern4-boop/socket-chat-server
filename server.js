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

const roomHistory = {};

// Optional test route
app.get("/", (req, res) => {
  res.send("Chat server is running");
});

io.on("connection", socket => {
  console.log("User connected:", socket.id);

  // Join private room
  socket.on("join", room => {
    socket.join(room);
    console.log(`${socket.id} joined room ${room}`);
    socket.on("join", room => {
  socket.join(room);
  if (roomHistory[room]) {
    roomHistory[room].forEach(msg => socket.emit("message", msg));
  }
});
  });

  // Text messages
  socket.on("message", data => {
  if (!roomHistory[data.room]) roomHistory[data.room] = [];
  roomHistory[data.room].push({ text: data.text });

  if (roomHistory[data.room].length > 100)
    roomHistory[data.room].shift();

  socket.to(data.room).emit("message", { text: data.text });
});

  // Voice messages
  socket.on("voice", data => {
    // data = { room, audio }
    socket.to(data.room).emit("voice", {
      audio: data.audio
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
