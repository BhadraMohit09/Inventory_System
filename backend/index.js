require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL, // allow your frontend domain
        credentials: true,
    })
);
app.use(express.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/stock", require("./routes/stock"));

// Root endpoint
app.get("/", (req, res) => {
    res.send("📦 Inventory Management API is running...");
});

// Start server
const PORT = process.env.PORT || 7000; // Render will override this automatically
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
