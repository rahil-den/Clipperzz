import Clip from "../models/Clip.js";

// @desc    Create a clip
// @route   POST /api/clips
export const createClip = async (req, res, next) => {
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
        next(error);
    }
};

// @desc    Get all clips for current user
// @route   GET /api/clips
export const getClips = async (req, res, next) => {
    try {
        const clips = await Clip.find({ user: req.user._id })
            .populate("video", "title sourceType")
            .sort({ createdAt: -1 });
        res.json(clips);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single clip
// @route   GET /api/clips/:id
export const getClipById = async (req, res, next) => {
    try {
        const clip = await Clip.findById(req.params.id).populate("video", "title sourceType");
        if (!clip) {
            return res.status(404).json({ message: "Clip not found" });
        }

        if (clip.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(clip);
    } catch (error) {
        next(error);
    }
};

// @desc    Update clip
// @route   PUT /api/clips/:id
export const updateClip = async (req, res, next) => {
    try {
        const clip = await Clip.findById(req.params.id);
        if (!clip) {
            return res.status(404).json({ message: "Clip not found" });
        }

        if (clip.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updatedClip = await Clip.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json(updatedClip);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete clip
// @route   DELETE /api/clips/:id
export const deleteClip = async (req, res, next) => {
    try {
        const clip = await Clip.findById(req.params.id);
        if (!clip) {
            return res.status(404).json({ message: "Clip not found" });
        }

        if (clip.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await clip.deleteOne();
        res.json({ message: "Clip deleted" });
    } catch (error) {
        next(error);
    }
};
