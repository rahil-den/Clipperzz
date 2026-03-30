/**
 * JWT Configuration
 *
 * Centralises all JWT settings. The secret is loaded from the environment
 * variable JWT_SECRET (generated via Node's built-in `crypto` module).
 *
 * To regenerate a secure secret run:
 *   node scripts/generateJwtSecret.js
 * and paste the output into your .env file.
 */

import jwt from "jsonwebtoken";

// ── Constants ─────────────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
    throw new Error(
        "JWT_SECRET is not defined in environment variables. " +
        "Run `node scripts/generateJwtSecret.js` to generate one and add it to your .env file."
    );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Signs a JWT for the given user id.
 * @param {string} userId - MongoDB ObjectId as string
 * @returns {string} signed JWT
 */
export const signToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifies a JWT and returns the decoded payload.
 * Throws if the token is invalid or expired.
 * @param {string} token
 * @returns {object} decoded payload
 */
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

export { JWT_SECRET, JWT_EXPIRES_IN };
