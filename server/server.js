<<<<<<< HEAD
const express = require("express");
const http = require("http");
const cors = require("cors");
const { userJoin, getUsers, userLeave } = require("./utils/user");

const app = express();
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);

app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.get("/", (req, res) => {
    res.send("server");
});

// socket.io
let imageUrl, userRoom;
io.on("connection", (socket) => {
    socket.on("user-joined", (data) => {
        const { roomId, userId, userName, host, presenter } = data;
        userRoom = roomId;
        const user = userJoin(socket.id, userName, roomId, host, presenter);
        const roomUsers = getUsers(user.room);
        socket.join(user.room);
        socket.emit("message", {
            message: "Welcome to ChatRoom",
        });
        socket.broadcast.to(user.room).emit("message", {
            message: `${user.username} has joined`,
        });

        io.to(user.room).emit("users", roomUsers);
        io.to(user.room).emit("canvasImage", imageUrl);
    });

    socket.on("drawing", (data) => {
        imageUrl = data;
        socket.broadcast.to(userRoom).emit("canvasImage", imageUrl);
    });

    socket.on("disconnect", () => {
        const userLeaves = userLeave(socket.id);
        const roomUsers = getUsers(userRoom);

        if (userLeaves) {
            io.to(userLeaves.room).emit("message", {
                message: `${userLeaves.username} left the chat`,
            });
            io.to(userLeaves.room).emit("users", roomUsers);
        }
    });
});

// serve on port
const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
    console.log(`server is listening on http://localhost:${PORT}`)
);
=======
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http,{
     cors: {
    origin: ["http://localhost:3000","http://localhost:5000"],
    methods: ["GET", "POST","PUT"],
    
    credentials: true

  }
},{
  allowEIO3: true // false by default
});

io.on('connection', (socket)=> {
      console.log('User Online');

      socket.on('canvas-data', (data)=> {
            socket.broadcast.emit('canvas-data', data);
            
      });
      socket.on("chat",(payload) =>{
            io.emit("chat",payload);
      });
    
});



var server_port =  5000;
http.listen(server_port, () => {
    console.log("Started on : "+ server_port);
})
>>>>>>> b056fd1c712d91da70d0f8f611e9d12083137669
