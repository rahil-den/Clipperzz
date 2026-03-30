import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Subscription from "../models/Subscription.js";
import Usage from "../models/Usage.js";
import { signToken } from "../config/jwt.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check for existing account
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password with a strong salt (12 rounds)
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user + default records
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            authProvider: "local",
        });

        await Subscription.create({ user: user._id, plan: "free" });
        await Usage.create({ user: user._id });

        // ✅ Best practice: do NOT issue a JWT here.
        // The user must verify their email (if enabled) then log in explicitly.
        res.status(201).json({
            message: "Registration successful. Please log in.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("[register]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Login user & return JWT
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch user including the hashed password field
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            // Same message for missing user & wrong password (prevent user enumeration)
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "Account is deactivated" });
        }

        // ✅ JWT is only issued here — after identity is confirmed
        const token = signToken(user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        console.error("[login]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private (requires valid JWT via auth middleware)
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("[getMe]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
