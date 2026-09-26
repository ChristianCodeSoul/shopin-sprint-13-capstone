require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();
const server = http.createServer(app);
const pubClient = createClient({
    url: process.env.REDIS_URL,
});
const subClient = pubClient.duplicate();

pubClient.on("error", (error) => {
    console.error("Redis Pub Client Error:", error);
});
subClient.on("error", (error) => {
    console.error("Redis Sub Client Error:", error);
});
const io = new Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});
app.set("io", io);
app.use(helmet());
app.use(
    cors({
        origin: true,
    })
);
app.use(express.json());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Sprint 13 backend is running",
    });
});


io.on("connection", (socket) => {
    console.log(
        `Socket connected: ${socket.id}`
    );
    socket.on("join-admin-room", () => {
        socket.join("admins");

        console.log(
            `Socket ${socket.id} joined admin room`
        );
    });
    socket.on("disconnect", (reason) => {
        console.log(
            `Socket disconnected: ${socket.id} — ${reason}`
        );
    });
});

const PORT = process.env.PORT || 4000;
async function startServer() {
    await connectDB();
    await Promise.all([
        pubClient.connect(),
        subClient.connect(),
    ]);
    io.adapter(
        createAdapter(pubClient, subClient)
    );
    console.log("Redis adapter connected");
    server.listen(PORT, () => {
        console.log(
            `Backend running on http://localhost:${PORT}`
        );
        console.log(
            `Socket.IO running on http://localhost:${PORT}`
        );
    });
}
if (require.main === module) {
    startServer().catch((error) => {
        console.error(
            "Failed to start server:",
            error
        );

        process.exit(1);
    });
}
module.exports = {
    app,
    server,
    io,
};