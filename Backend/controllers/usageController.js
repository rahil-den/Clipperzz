import Usage from "../models/Usage.js";

// @desc    Get current user's usage
// @route   GET /api/usage/me
// @access  Private
export const getMyUsage = async (req, res) => {
    try {
        const usage = await Usage.findOne({ user: req.user._id });
        if (!usage) {
            return res.status(404).json({ message: "No usage record found" });
        }
        res.json(usage);
    } catch (error) {
        console.error("[getMyUsage]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get all usage records (admin)
// @route   GET /api/usage
// @access  Private / Admin
export const getAllUsage = async (req, res) => {
    try {
        const records = await Usage.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 });
        res.json(records);
    } catch (error) {
        console.error("[getAllUsage]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Update usage record (admin)
// @route   PUT /api/usage/:id
// @access  Private / Admin
export const updateUsage = async (req, res) => {
    try {
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
        console.error("[updateUsage]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Reset usage counters for a user (admin)
// @route   POST /api/usage/:id/reset
// @access  Private / Admin
export const resetUsage = async (req, res) => {
    try {
        const usage = await Usage.findById(req.params.id);
        if (!usage) {
            return res.status(404).json({ message: "Usage record not found" });
        }

        usage.videosProcessed = 0;
        usage.clipsGenerated = 0;
        const now = new Date();
        usage.resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const updated = await usage.save();
        res.json({ message: "Usage reset successfully", usage: updated });
    } catch (error) {
        console.error("[resetUsage]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
