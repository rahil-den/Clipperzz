import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/db.js";


// Route imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import clipRoutes from "./routes/clipRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import usageRoutes from "./routes/usageRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    res.send("Clipperz API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/clips", clipRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/reports", reportRoutes);

// Error handler (must be after routes)


// Connect to DB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
