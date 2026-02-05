const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// 🔹 IN-MEMORY CHAT HISTORY
const roomHistory = {};

io.on("connection", socket => {
  console.log("Connected:", socket.id);

  socket.on("join", room => {
    socket.join(room);

    // 🔹 SEND HISTORY TO NEW USER
    if (roomHistory[room]) {
      roomHistory[room].forEach(msg => {
        socket.emit("message", msg);
      });
    }
  });

  socket.on("message", data => {
    // data = { room, text }

    if (!roomHistory[data.room]) {
      roomHistory[data.room] = [];
    }

    const msg = { text: data.text };

    roomHistory[data.room].push(msg);

    // limit history
    if (roomHistory[data.room].length > 100) {
      roomHistory[data.room].shift();
    }

    // send to others
    socket.to(data.room).emit("message", msg);
  });

  socket.on("voice", data => {
    socket.to(data.room).emit("voice", {
      audio: data.audio
    });
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
