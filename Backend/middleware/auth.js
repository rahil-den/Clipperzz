import User from "../models/User.js";
import { verifyToken } from "../config/jwt.js";

/**
 * protect — verifies the Bearer JWT and attaches req.user.
 * Must be applied to every private route.
 */
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // verifyToken throws on invalid / expired tokens
            const decoded = verifyToken(token);

            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res
                    .status(401)
                    .json({ message: "Not authorized, user not found" });
            }

            return next();
        } catch (error) {
            console.error("[auth middleware]", error.message);
            return res
                .status(401)
                .json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

/**
 * admin — ensures the authenticated user has admin or superadmin role.
 * Must be used AFTER protect.
 */
const admin = (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as an admin" });
    }
};

export { protect, admin };
