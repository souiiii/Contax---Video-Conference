import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());

// app.use(express.static(path.join(__dirname, "client", "dist")));

// app.use((req, res) =>
//   res.sendFile(path.join(__dirname, "client", "dist", "index.html")),
// );
//

const emailToSocketMapping = new Map();

io.on("connection", (socket) => {
  console.log("user connected: ", socket.id);

  socket.on("join-room", (data) => {
    const { roomId, emailId } = data;
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-joined", emailId);
  });

  socket.on("disconnect", (reason) => {
    console.log(`user disconnected: ${socket.id} because ${reason}`);
  });
});

server.listen(PORT, () => console.log("server started"));
