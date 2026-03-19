import Video from "../models/Video.js";

// @desc    Create a video
// @route   POST /api/videos
export const createVideo = async (req, res, next) => {
    try {
        const { title, sourceType, sourceUrl, duration } = req.body;

        const video = await Video.create({
            user: req.user._id,
            title,
            sourceType,
            sourceUrl,
            duration,
        });

        res.status(201).json(video);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all videos for current user
// @route   GET /api/videos
export const getVideos = async (req, res, next) => {
    try {
        const videos = await Video.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(videos);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single video
// @route   GET /api/videos/:id
export const getVideoById = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        if (video.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(video);
    } catch (error) {
        next(error);
    }
};

// @desc    Update video
// @route   PUT /api/videos/:id
export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        if (video.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updatedVideo = await Video.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json(updatedVideo);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        if (video.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await video.deleteOne();
        res.json({ message: "Video deleted" });
    } catch (error) {
        next(error);
    }
};
