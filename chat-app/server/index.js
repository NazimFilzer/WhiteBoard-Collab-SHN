const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
// const { Server } = require("socket.io");
// app.use(cors());

app.use(cors());

const server = http.createServer(app);

server.listen(5001, () => {
    console.log("server running");
});


