const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://collaber.netlify.app","https://collaber.onrender.com/","https://collaber.onrender.com"],
    methods: ["GET", "POST"],
  },
});

let connections = new Set(); //tracks all unique connections to server
let roomsData = {}; //tracks all room data
//example : roomsData = {'12345' : {'count' : 5, 'members' : set of users}}

let mostRecentCanvasData = {} //tracks all room most recent canvas Data
//example : mostRecentCanvasData = {'12345' : canvasData}

io.on("connection", (socket) => {
  //adding this new connection to connections set
  connections.add(socket);
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", async (data) => {
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
    let roomId = data.room;
    socket.join(roomId);

    await handleRoomJoin(socket, roomId);
    io.to(roomId).emit("members", roomsData[roomId]);

    if(mostRecentCanvasData[roomId]) {
      io.to(roomId).emit("receive_canvas_data", mostRecentCanvasData[roomId]);
    }
    console.log(
      `User with ID: ${socket.id} and username: ${data.username} joined room: ${data.room}`
    );
    socket.data.username = data.username;
    socket.data.room = data.room;
    const messageData = {
      room: data.room,
      author: "Bot",
      message: `${data.username} has joined the room.`,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    socket.to(data.room).emit("receive_message", messageData);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", async () => {
    console.log("User Disconnected", socket.id);
    await handleRoomLeave(socket);
    const messageData = {
      room: socket.data.room,
      author: "Bot",
      message: `${socket.data.username} has disconnected from the room.`,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    socket.to(socket.data.room).emit("receive_message", messageData);
  });

  socket.on("send_canvas_data", (data) => {
    updateMostRecentCanvasData(data.room, data.canvas);
    socket.to(data.room).emit("receive_canvas_data", data.canvas);
  });
});

/**
 * add user to room with given id and maintains count of users in that room
 * @param {*} socket instance of socket,
 * @param {*} roomId id of the room
 */
const handleRoomJoin = async (socket, roomId) => {
  let roomIdExists = roomsData[roomId] !== undefined;
  if (roomIdExists) {
    let targetRoomData = roomsData[roomId];
    targetRoomData["count"] += 1;
    targetRoomData["members"].add(socket);
    roomsData[roomId] = targetRoomData;
  } else {
    let members = new Set();
    members.add(socket);
    let tempData = { count: 1, members: members };
    roomsData[roomId] = tempData;
  }
};

/**
 * when a user disconnects, delete that user from all rooms in which he was joined earlier
 * @param {*} socket instance of socket,
 */
const handleRoomLeave = async (socket) => {
  //delete from connection set
  connections.delete(socket);
  //update roomData;
  for (let key in roomsData) {
    let currRoomData = roomsData[key];
    if (currRoomData["members"].has(socket)) {
      currRoomData["members"].delete(socket);
      currRoomData["count"] -= 1;
      roomsData[key] = currRoomData;
      io.to(key).emit("members", currRoomData);
    }
  }
};

const updateMostRecentCanvasData = (roomId, data) => {
  mostRecentCanvasData[roomId] = data;
}

const getCanvasData = (roomId) => {
  return mostRecentCanvasData[roomId];
}

app.get("/", (req, res) => {
  res.send("testing");
});

server.listen(process.env.PORT || 3001, () => {
  console.log("SERVER RUNNING");
});
