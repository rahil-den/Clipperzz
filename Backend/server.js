import dotenv from "dotenv";
dotenv.config(); // Must be first — loads env before any other imports use process.env

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

// Route imports
import authRoutes         from "./routes/authRoutes.js";
import userRoutes         from "./routes/userRoutes.js";
import videoRoutes        from "./routes/videoRoutes.js";
import clipRoutes         from "./routes/clipRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import usageRoutes        from "./routes/usageRoutes.js";
import jobRoutes          from "./routes/jobRoutes.js";
import logRoutes          from "./routes/logRoutes.js";
import reportRoutes       from "./routes/reportRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ── Global Middleware ─────────────────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({ message: "Clipperz API is running ✅", timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/users",         userRoutes);
app.use("/api/videos",        videoRoutes);
app.use("/api/clips",         clipRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/usage",         usageRoutes);
app.use("/api/jobs",          jobRoutes);
app.use("/api/logs",          logRoutes);
app.use("/api/reports",       reportRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ── Global Error Handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});
