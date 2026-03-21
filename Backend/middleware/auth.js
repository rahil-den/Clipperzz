import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    // ---------------------------------------------------------------- //
    // TEMPORARY BYPASS FOR DEVELOPMENT AND POSTMAN TESTING WITHOUT TOKEN
    // ---------------------------------------------------------------- //
    try {
        // Fetch any existing user to use for requests
        req.user = await User.findOne(); 
        if (!req.user) {
            // Mock object if DB is empty
            req.user = { _id: "605c72abfc13ae300f000000", id: "605c72abfc13ae300f000000", role: "superadmin", name: "Test Admin", email: "admin@test.com" };
        }
        next();
    } catch (error) {
        console.error(error);
        next();
    }
};

export default protect;
