import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userroute.js";
import messageRoutes from "./routes/messageroute.js";
import roomRoutes from "./routes/roomroutes.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();

// === Allowed Origins ===
const allowedOrigins = [
  "http://localhost:5173",
  "https://yourproject.netlify.app", // optional for later
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /https:\/\/.*\.netlify\.app$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /https:\/\/.*\.netlify\.app$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Socket.io CORS Error"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/rooms", roomRoutes);

io.on("connection", (socket) => {
  const userId = socket.handshake.query.user_name;
  console.log("✅ User connected:", userId);

  socket.on("join_private", (roomId) => {
    socket.join(roomId);
    console.log(`👤 ${userId} joined private room: ${roomId}`);
  });

  socket.on("join_group", (roomId) => {
    socket.join(roomId);
    console.log(`👥 ${userId} joined group room: ${roomId}`);
  });

  socket.on("send_private_message", ({ roomId, message }) => {
    io.to(roomId).emit("receive_message", { ...message, roomId });
  });

  socket.on("send_group_message", ({ roomId, message }) => {
    io.to(roomId).emit("receive_message", { ...message, roomId });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", userId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
