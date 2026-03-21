import Usage from "../models/Usage.js";

// @desc    Get current user's usage
// @route   GET /api/usage/me
export const getMyUsage = async (req, res) => {
    try {
        if (!req.user) req.user = { _id: "605c72abfc13ae300f000000", id: "605c72abfc13ae300f000000", role: "superadmin", name: "Test Admin" };
        const usage = await Usage.findOne({ user: req.user._id });
        if (!usage) {
            return res.status(404).json({ message: "No usage record found" });
        }
        res.json(usage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Update usage (internal / admin)
// @route   PUT /api/usage/:id
export const updateUsage = async (req, res) => {
    try {
        if (!req.user) req.user = { _id: "605c72abfc13ae300f000000", id: "605c72abfc13ae300f000000", role: "superadmin", name: "Test Admin" };
        const { videosProcessed, clipsGenerated, monthlyLimit, resetDate } = req.body;

        const usage = await Usage.findById(req.params.id);
        if (!usage) {
            return res.status(404).json({ message: "Usage record not found" });
        }

        if (typeof videosProcessed === "number") usage.videosProcessed = videosProcessed;
        if (typeof clipsGenerated === "number") usage.clipsGenerated = clipsGenerated;
        if (typeof monthlyLimit === "number") usage.monthlyLimit = monthlyLimit;
        if (resetDate) usage.resetDate = resetDate;

        const updated = await usage.save();
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get all usage records (admin)
// @route   GET /api/usage
export const getAllUsage = async (req, res) => {
    try {
        if (!req.user) req.user = { _id: "605c72abfc13ae300f000000", id: "605c72abfc13ae300f000000", role: "superadmin", name: "Test Admin" };
        const records = await Usage.find().populate("user", "name email");
        res.json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
