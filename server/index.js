require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const port = process.env.PORT || 5001;
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);

// deployment
const _dirname1 = path.resolve();
// console.log("hello", process.env.NODE_ENV);
if (true) {
  app.use(express.static(path.join(_dirname1, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname1, "client", "dist", "index.html"));
  });
} else {
  app.get("/", async (req, res) => {
    res.send("Server is runnig!!!");
  });
}
// deployment

const io = socketIO(server, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.0.116:5173"],
    methods: ["POST", "GET"],
    credential: true,
  },
});

io.on("connection", (socket) => {
  socket.on("add-user", (username) => {
    socket.username = username;
    socket.broadcast.emit("user-added", { username });
  });
  socket.on("send-message", (message) => {
    console.log("message", message);
    socket.broadcast.emit("message-sended", message);
  });
});

server.listen(port, () => {
  console.log(`Server running from ${port}`);
});
