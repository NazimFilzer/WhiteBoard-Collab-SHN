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

io.on("connection",(socket) => {
    console.log(socket.id);

    socket.on("disconnect", () => {
        consol.log("User disconned", socket.id)
    })
})

server.listen(5001, () => {
    console.log("server running");
});


