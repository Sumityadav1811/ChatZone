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

// === DYNAMIC CORS HANDLING ===
const allowedOrigins = ["http://localhost:5173"];

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

// === HTTP + Socket.IO setup ===
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
        callback(new Error("Not allowed by Socket.io CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// === DB + Routes ===
connectDB();
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/rooms", roomRoutes);

// === Socket.IO events ===
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
    const messageWithRoom = { ...message, roomId };
    io.to(roomId).emit("receive_message", messageWithRoom);
  });

  socket.on("send_group_message", ({ roomId, message }) => {
    const messageWithRoom = { ...message, roomId };
    io.to(roomId).emit("receive_message", messageWithRoom);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", userId);
  });
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
