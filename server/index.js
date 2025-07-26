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

const allowedOrigins = [
  "http://localhost:5173", // ✅ for local dev
  "https://chatozone.netlify.app", // ✅ for production
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true, // ⚠️ required for cookies/auth in future
  })
);
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // your React frontend
    methods: ["GET", "POST"],
  },
});

connectDB(); // still connecting DB for other routes

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/rooms", roomRoutes);

io.on("connection", (socket) => {
  const userId = socket.handshake.query.user_name;
  console.log("✅ User connected:", userId);

  // --- JOIN ROOM (both group or 1-1) ---
  socket.on("join_private", (roomId) => {
    socket.join(roomId);
    console.log(`👤 ${userId} joined private room: ${roomId}`);
  });

  socket.on("join_group", (roomId) => {
    socket.join(roomId);
    console.log(`👥 ${userId} joined group room: ${roomId}`);
  });

  socket.on("send_private_message", ({ roomId, message }) => {
    const messageWithRoom = { ...message, roomId }; // add roomId here
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
