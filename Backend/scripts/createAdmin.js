import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import Subscription from "../models/Subscription.js";
import Usage from "../models/Usage.js";

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const adminEmail = "admin@clipperz.io";
        const adminPassword = "ClipperzzAdmin@2024";

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("Admin user already exists.");
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const admin = await User.create({
            name: "Super Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "superadmin",
            isActive: true,
        });

        await Subscription.create({ user: admin._id, plan: "pro" });
        await Usage.create({ user: admin._id });

        console.log("Admin user created successfully!");
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        
        process.exit(0);
    } catch (error) {
        console.error("Error creating admin user:", error.message);
        process.exit(1);
    }
};

createAdmin();
