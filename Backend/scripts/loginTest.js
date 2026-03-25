import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = "admin@clipperz.io";
        const password = "ClipperzzAdmin@2024";

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            console.log("User not found!");
            process.exit(1);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Email Check: ${user.email === email}`);
        console.log(`Password Match: ${isMatch}`);
        console.log(`User Role: ${user.role}`);
        
        process.exit(0);
    } catch (error) {
        console.error("Error testing login:", error.message);
        process.exit(1);
    }
};

testLogin();
