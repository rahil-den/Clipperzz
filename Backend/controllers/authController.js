import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import PendingUser from "../models/PendingUser.js";
import Subscription from "../models/Subscription.js";
import Usage from "../models/Usage.js";
import { signToken } from "../config/jwt.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../config/email.js";
import { sendWelcomeSMS } from "../config/sms.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Generates a cryptographically-secure URL-safe token and its
 * SHA-256 hash (the hash is stored in DB; the raw token goes in the email).
 */
const generateEmailToken = () => {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    return { rawToken, hashedToken, expires };
};

// @desc    Register a new user (stores in PendingUser until email is verified)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, countryCode, phone } = req.body;

        // Check if fully registered user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password with a strong salt (12 rounds)
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate email verification token
        const { rawToken, hashedToken, expires } = generateEmailToken();

        // Upsert into PendingUser — if someone re-registers with the same
        // email before verifying, we simply overwrite the old pending entry.
        await PendingUser.findOneAndUpdate(
            { email },
            {
                name,
                email,
                password: hashedPassword,
                countryCode: countryCode || "+91",
                phone: phone || null,
                emailVerificationToken: hashedToken,
                emailVerificationExpires: expires,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Send verification email
        try {
            await sendVerificationEmail(email, name, rawToken);
        } catch (emailError) {
            console.error("[register] Failed to send verification email:", emailError.message);
            // Registration still succeeds — user can request a resend
        }

        res.status(201).json({
            message: "Registration successful. Please check your email to verify your account.",
            email,
        });
    } catch (error) {
        console.error("[register]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Verify email address via token from email link
// @route   GET /api/auth/verify-email?token=<rawToken>
// @access  Public
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ message: "Verification token is required" });
        }

        // Hash the incoming raw token to compare with the stored hash
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // Look in PendingUser for matching, non-expired token
        const pendingUser = await PendingUser.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpires: { $gt: new Date() },
        });

        if (!pendingUser) {
            return res.status(400).json({
                message: "Invalid or expired verification token. Please request a new one.",
            });
        }

        // Check if a verified user with this email already exists (edge case)
        const existingUser = await User.findOne({ email: pendingUser.email });
        if (existingUser) {
            // Clean up pending entry and let them log in
            await PendingUser.deleteOne({ _id: pendingUser._id });
            return res.status(400).json({
                message: "This email is already registered. Please log in.",
            });
        }

        // Promote to a real User
        const user = await User.create({
            name: pendingUser.name,
            email: pendingUser.email,
            password: pendingUser.password,
            countryCode: pendingUser.countryCode,
            phone: pendingUser.phone,
            authProvider: "local",
            emailVerified: true,
        });

        // Create default subscription & usage records
        await Subscription.create({ user: user._id, plan: "starter" });
        await Usage.create({ user: user._id });

        // Clean up the pending entry
        await PendingUser.deleteOne({ _id: pendingUser._id });

        // Issue a JWT so the frontend can log the user in immediately
        const jwtToken = signToken(user._id);

        // Send welcome email now that the account is fully activated
        try {
            await sendWelcomeEmail(user.email, user.name);
        } catch (emailError) {
            console.error("[verifyEmail] Failed to send welcome email:", emailError.message);
        }

        // Send welcome SMS if the user provided a phone number
        if (user.phone) {
            try {
                await sendWelcomeSMS(user.phone, user.countryCode, user.name);
            } catch (smsError) {
                console.error("[verifyEmail] Failed to send welcome SMS:", smsError.message);
            }
        }

        console.log(`[verifyEmail] Email verified & user created for: ${user.email}`);

        res.json({
            message: "Email verified successfully! Welcome to Clipperz.",
            token: jwtToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: true,
            },
        });
    } catch (error) {
        console.error("[verifyEmail]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if already fully registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "This email is already verified. Please log in." });
        }

        // Find in pending users
        const pendingUser = await PendingUser.findOne({ email });
        if (!pendingUser) {
            // Don't reveal whether the email exists
            return res.json({ message: "If this email is registered, a new verification link has been sent." });
        }

        // Generate a fresh token
        const { rawToken, hashedToken, expires } = generateEmailToken();
        pendingUser.emailVerificationToken = hashedToken;
        pendingUser.emailVerificationExpires = expires;
        await pendingUser.save();

        await sendVerificationEmail(pendingUser.email, pendingUser.name, rawToken);

        res.json({ message: "Verification email resent. Please check your inbox." });
    } catch (error) {
        console.error("[resendVerification]", error);
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
            // Check if there's a pending registration for this email
            const pendingUser = await PendingUser.findOne({ email });
            if (pendingUser) {
                return res.status(403).json({
                    message: "Please verify your email before logging in. Check your inbox for the verification link.",
                    needsVerification: true,
                    email,
                });
            }
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
            emailVerified: user.emailVerified,
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
