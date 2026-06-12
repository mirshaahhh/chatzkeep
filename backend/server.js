const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Make io accessible in routes (optional but useful)
app.set("io", io);

// ================= SOCKET LOGIC =================
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // STEP 1: Join user-specific room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });

  // STEP 2: Send message (private + notification)
  socket.on("sendMessage", (message) => {
    const { receiver, sender, text } = message;

    console.log("Message received:", message);

    // Send message ONLY to receiver
    io.to(receiver).emit("receiveMessage", message);

    // Send notification ONLY to receiver
    io.to(receiver).emit("newNotification", {
      type: "message",
      text: `New message from ${sender}`,
      time: new Date(),
    });
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API Running...");
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});