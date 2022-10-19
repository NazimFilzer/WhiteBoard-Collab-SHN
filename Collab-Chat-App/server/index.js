const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {

  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data.room);
    console.log(`User with ID: ${socket.id} and username: ${data.username} joined room: ${data.room}`);
    socket.data.username = data.username;
    socket.data.room = data.room;
    const messageData = {
      room: data.room,
      author: 'Server',
      message: `User ${data.username} has joined the room.`,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    socket.to(data.room).emit("receive_message", messageData);
    socket.to(data.room).emit("back", "Hello")
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    const messageData = {
      room: socket.data.room,
      author: 'Server',
      message: `User ${socket.data.username} has disconnected from the room.`,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    socket.to(socket.data.room).emit("receive_message", messageData);
  });
  
  socket.on('send_canvas_data', (data) => {
    socket.to(data.room).emit('receive_canvas_data', data.canvas);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
