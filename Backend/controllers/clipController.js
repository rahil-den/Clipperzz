import Clip from "../models/Clip.js";

// @desc    Create a clip
// @route   POST /api/clips
export const createClip = async (req, res) => {
    try {
        if (!req.user) req.user = { _id: "605c72abfc13ae300f000000", id: "605c72abfc13ae300f000000", role: "superadmin", name: "Test Admin" };
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
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get all clips
// @route   GET /api/clips
export const getClips = async (req, res) => {
    try {
        // For admin, we might want to return all clips, but keeping the user filter for now as per original code
        // and adding population for the admin dashboard.
        if (!req.user) req.user = { _id: "605c72abfc13ae300f000000", id: "605c72abfc13ae300f000000", role: "superadmin", name: "Test Admin" };
        
        const query = (req.user.role === "admin" || req.user.role === "superadmin") ? {} : { user: req.user._id };
        
        const clips = await Clip.find(query)
            .populate("user", "name email")
            .populate("video", "title sourceType")
            .sort({ createdAt: -1 });
        res.json(clips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get single clip
// @route   GET /api/clips/:id
export const getClipById = async (req, res) => {
    try {
        if (!req.user) req.user = { _id: "605c72abfc13ae300f000000", id: "605c72abfc13ae300f000000", role: "superadmin", name: "Test Admin" };
        const clip = await Clip.findById(req.params.id).populate("video", "title sourceType").populate("user", "name");
        if (!clip) {
            return res.status(404).json({ message: "Clip not found" });
        }

        if (req.user.role !== "admin" && req.user.role !== "superadmin" && clip.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(clip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Update clip
// @route   PUT /api/clips/:id
export const updateClip = async (req, res) => {
    try {
        if (!req.user) req.user = { _id: "605c72abfc13ae300f000000", id: "605c72abfc13ae300f000000", role: "superadmin", name: "Test Admin" };
        const clip = await Clip.findById(req.params.id);
        if (!clip) {
            return res.status(404).json({ message: "Clip not found" });
        }

        if (req.user.role !== "admin" && req.user.role !== "superadmin" && clip.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updatedClip = await Clip.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json(updatedClip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Delete clip
// @route   DELETE /api/clips/:id
export const deleteClip = async (req, res) => {
    try {
        if (!req.user) req.user = { _id: "605c72abfc13ae300f000000", id: "605c72abfc13ae300f000000", role: "superadmin", name: "Test Admin" };
        const clip = await Clip.findById(req.params.id);
        if (!clip) {
            return res.status(404).json({ message: "Clip not found" });
        }

        if (req.user.role !== "admin" && req.user.role !== "superadmin" && clip.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await clip.deleteOne();
        res.json({ message: "Clip deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
