import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/chat', chatRoutes);

// Store online users (userId -> socketId)
const onlineUsers = new Map();

// Socket.io Connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // When a user joins, store their socket ID
    socket.on("join", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log("Online Users:", onlineUsers);
    });

    // Handle sending messages
    socket.on("sendMessage", async (message) => {
        console.log("Message received:", message);

        // Check if recipient is online
        const recipientSocketId = onlineUsers.get(message.receiverId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", message); // Send message only to recipient
        }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        console.log("User disconnected:", socket.id);
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
