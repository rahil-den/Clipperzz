import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Job from "../models/Job.js";
import AuditLog from "../models/AuditLog.js";
import UserReport from "../models/UserReport.js";

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        const admin = await User.findOne({ role: "superadmin" });
        const user = await User.findOne({ role: "user" });

        if (!admin || !user) {
            console.error("Seed failed: Could not find admin or user in DB. Run createAdmin.js first.");
            process.exit(1);
        }

        // ─── Seed Jobs ───────────────────────────────────────────────────────────
        await Job.deleteMany({});
        await Job.create([
            { user: user._id, type: "clip_generation", status: "processing", progress: 65, startedAt: new Date(Date.now() - 1000 * 60 * 2) },
            { user: user._id, type: "video_upload", status: "queued", progress: 0, startedAt: new Date(Date.now() - 1000 * 60 * 5) },
            { user: user._id, type: "clip_generation", status: "completed", progress: 100, startedAt: new Date(Date.now() - 1000 * 60 * 10), completedAt: new Date(Date.now() - 1000 * 60 * 8) },
            { user: user._id, type: "export", status: "failed", progress: 45, startedAt: new Date(Date.now() - 1000 * 60 * 15), error: "Memory limit exceeded" },
        ]);
        console.log("Jobs seeded.");

        // ─── Seed Logs ───────────────────────────────────────────────────────────
        await AuditLog.deleteMany({});
        await AuditLog.create([
            { admin: admin._id, action: "User suspended", target: "mike@example.com", type: "user", details: "Terms of service violation" },
            { admin: admin._id, action: "Pricing updated", target: "Pro Monthly: $29 -> $35", type: "system" },
            { admin: admin._id, action: "Admin created", target: "sarah.m@clipperz.io", type: "admin" },
        ]);
        console.log("Logs seeded.");

        // ─── Seed Reports ────────────────────────────────────────────────────────
        await UserReport.deleteMany({});
        await UserReport.create([
            { user: user._id, type: "report", category: "bug", title: "Video upload fails on large files", description: "When uploading videos over 500MB, the upload fails without error message", status: "open", priority: "high" },
            { user: user._id, type: "feedback", category: "feature", title: "TikTok Templates", description: "Would love to see more templates for TikTok", status: "new", priority: "medium" },
            { user: user._id, type: "contact", category: "other", title: "API access help", description: "I upgraded to enterprise but can't find my API keys", status: "pending", priority: "high" },
        ]);
        console.log("Reports seeded.");

        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error.message);
        process.exit(1);
    }
};

seedData();
