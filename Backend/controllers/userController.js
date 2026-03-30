import bcrypt from "bcryptjs";
import User from "../models/User.js";

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private / Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error("[getUsers]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private / Admin
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("[getUserById]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Create new user (admin)
// @route   POST /api/users
// @access  Private / Admin
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role, isActive } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password if provided
        let hashedPassword = null;
        if (password) {
            const salt = await bcrypt.genSalt(12);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
            isActive: isActive !== undefined ? isActive : true,
        });

        res.status(201).json(user);
    } catch (error) {
        console.error("[createUser]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Update user (admin)
// @route   PUT /api/users/:id
// @access  Private / Admin
export const updateUser = async (req, res) => {
    try {
        const { name, email, role, isActive } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (typeof isActive === "boolean") user.isActive = isActive;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        console.error("[updateUser]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
// @access  Private / Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne();
        res.json({ message: "User deleted" });
    } catch (error) {
        console.error("[deleteUser]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
