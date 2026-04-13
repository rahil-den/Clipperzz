import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const existing = await User.findOne({ role: "user" });
        if (existing) {
            console.log("Test user already exists:", existing.email);
            process.exit(0);
        }

        const hash = await bcrypt.hash("TestUser@2024", 10);
        const user = await User.create({
            name: "Test User",
            email: "testuser@clipperz.io",
            password: hash,
            role: "user",
            isActive: true,
            isEmailVerified: true,
        });

        console.log("Test user created:", user.email);
        process.exit(0);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

createTestUser();
