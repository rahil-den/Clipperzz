import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import Subscription from "../models/Subscription.js";
import Usage from "../models/Usage.js";
import { signToken } from "../config/jwt.js";
import { sendWelcomeEmail } from "../config/email.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Authenticate with Google ID token
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: "Google credential is required" });
        }

        // Verify the Google ID token
        let ticket;
        try {
            ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
        } catch (verifyError) {
            console.error("[googleAuth] Token verification failed:", verifyError.message);
            return res.status(401).json({ message: "Invalid Google token" });
        }

        const payload = ticket.getPayload();
        const { email, name, picture, email_verified } = payload;

        if (!email_verified) {
            return res.status(401).json({ message: "Google email is not verified" });
        }

        // Check if a user with this email already exists
        let user = await User.findOne({ email });

        if (user) {
            // Existing user — check if account is active
            if (!user.isActive) {
                return res.status(403).json({ message: "Account is deactivated" });
            }

            // If user signed up with local auth, link Google (update authProvider)
            if (user.authProvider === "local" && !user.password) {
                // Edge case: local user without a password — update to google
                user.authProvider = "google";
                await user.save();
            }
        } else {
            // New user — create account (skip email verification since Google already verified)
            user = await User.create({
                name,
                email,
                password: null,
                authProvider: "google",
                emailVerified: true,
            });

            // Create default subscription & usage records
            await Subscription.create({ user: user._id, plan: "free" });
            await Usage.create({ user: user._id });

            // Send welcome email
            try {
                await sendWelcomeEmail(email, name);
            } catch (emailError) {
                console.error("[googleAuth] Failed to send welcome email:", emailError.message);
            }

            console.log(`[googleAuth] New user created via Google: ${email}`);
        }

        // Issue a JWT
        const token = signToken(user._id);

        console.log(`[googleAuth] Login successful for: ${email}`);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified,
            token,
        });
    } catch (error) {
        console.error("[googleAuth]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
