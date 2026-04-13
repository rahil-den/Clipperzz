// This file must be imported FIRST in server.js.
// In ES modules, all imports are hoisted before any code runs,
// so dotenv.config() inside server.js runs too late.
// By putting it in a dedicated module imported first, we ensure
// env vars are loaded before any other module reads process.env.
import dotenv from "dotenv";
dotenv.config();
