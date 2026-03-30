import Clip from "../models/Clip.js";

// helper: is the caller an admin?
const isAdmin = (user) =>
    user.role === "admin" || user.role === "superadmin";

// @desc    Create a clip
// @route   POST /api/clips
// @access  Private
export const createClip = async (req, res) => {
    try {
        const { video, title, clipUrl, duration, platform } = req.body;

        const clip = await Clip.create({
            user: req.user._id,
            video,
            title,
            clipUrl,
            duration,
            platform,
        });

        res.status(201).json(clip);
    } catch (error) {
        console.error("[createClip]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get clips — all for admins, own for regular users
// @route   GET /api/clips
// @access  Private
export const getClips = async (req, res) => {
    try {
        const query = isAdmin(req.user) ? {} : { user: req.user._id };

        const clips = await Clip.find(query)
            .populate("user", "name email")
            .populate("video", "title sourceType")
            .sort({ createdAt: -1 });

        res.json(clips);
    } catch (error) {
        console.error("[getClips]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get single clip
// @route   GET /api/clips/:id
// @access  Private
export const getClipById = async (req, res) => {
    try {
        const clip = await Clip.findById(req.params.id)
            .populate("video", "title sourceType")
            .populate("user", "name email");

        if (!clip) {
            return res.status(404).json({ message: "Clip not found" });
        }

        // Non-admins can only view their own clips
        if (!isAdmin(req.user) && clip.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(clip);
    } catch (error) {
        console.error("[getClipById]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Update clip (owner or admin)
// @route   PUT /api/clips/:id
// @access  Private
export const updateClip = async (req, res) => {
    try {
        const clip = await Clip.findById(req.params.id);
        if (!clip) {
            return res.status(404).json({ message: "Clip not found" });
        }

        if (!isAdmin(req.user) && clip.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updatedClip = await Clip.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json(updatedClip);
    } catch (error) {
        console.error("[updateClip]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Update clip score (admin / internal AI pipeline)
// @route   PATCH /api/clips/:id/score
// @access  Private (admin)
export const updateClipScore = async (req, res) => {
    try {
        const { clipScore, scoreBreakdown, aiInsight } = req.body;

        const clip = await Clip.findById(req.params.id);
        if (!clip) {
            return res.status(404).json({ message: "Clip not found" });
        }

        if (clipScore !== undefined) clip.clipScore = clipScore;
        if (scoreBreakdown) clip.scoreBreakdown = { ...clip.scoreBreakdown, ...scoreBreakdown };
        if (aiInsight) clip.aiInsight = aiInsight;

        const updated = await clip.save();
        res.json(updated);
    } catch (error) {
        console.error("[updateClipScore]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get clip stats for the current user (or all if admin)
// @route   GET /api/clips/stats
// @access  Private
export const getClipStats = async (req, res) => {
    try {
        const matchStage = isAdmin(req.user) ? {} : { user: req.user._id };

        const stats = await Clip.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    avgScore: { $avg: "$clipScore" },
                    ready: { $sum: { $cond: [{ $eq: ["$status", "ready"] }, 1, 0] } },
                    processing: { $sum: { $cond: [{ $eq: ["$status", "processing"] }, 1, 0] } },
                    failed: { $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] } },
                    totalDuration: { $sum: "$duration" },
                },
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                    avgScore: { $round: ["$avgScore", 1] },
                    ready: 1,
                    processing: 1,
                    failed: 1,
                    totalDuration: 1,
                },
            },
        ]);

        res.json(stats[0] || { total: 0, avgScore: null, ready: 0, processing: 0, failed: 0, totalDuration: 0 });
    } catch (error) {
        console.error("[getClipStats]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Delete clip (owner or admin)
// @route   DELETE /api/clips/:id
// @access  Private
export const deleteClip = async (req, res) => {
    try {
        const clip = await Clip.findById(req.params.id);
        if (!clip) {
            return res.status(404).json({ message: "Clip not found" });
        }

        if (!isAdmin(req.user) && clip.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await clip.deleteOne();
        res.json({ message: "Clip deleted" });
    } catch (error) {
        console.error("[deleteClip]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
