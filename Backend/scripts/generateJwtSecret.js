/**
 * JWT Secret Generator
 *
 * Uses Node's built-in `crypto` module to generate a 64-byte (512-bit)
 * cryptographically secure random secret.
 *
 * Usage:
 *   node scripts/generateJwtSecret.js
 *
 * Copy the printed line into your .env file, replacing the existing JWT_SECRET.
 * NEVER commit the .env file to version control.
 */

import crypto from "crypto";

const secret = crypto.randomBytes(64).toString("hex");

console.log("\n Secure JWT secret generated successfully!\n");
console.log("─".repeat(60));
console.log(`JWT_SECRET=${secret}`);
console.log("─".repeat(60));
console.log("\n Paste the line above into your .env file.\n");
