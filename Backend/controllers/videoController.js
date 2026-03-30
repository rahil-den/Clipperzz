import Video from "../models/Video.js";

const isAdmin = (user) =>
    user.role === "admin" || user.role === "superadmin";

// @desc    Create a video
// @route   POST /api/videos
// @access  Private
export const createVideo = async (req, res) => {
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
        console.error("[createVideo]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get videos — all for admins, own for users
// @route   GET /api/videos
// @access  Private
export const getVideos = async (req, res) => {
    try {
        const query = isAdmin(req.user) ? {} : { user: req.user._id };

        const videos = await Video.find(query)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json(videos);
    } catch (error) {
        console.error("[getVideos]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Private
export const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id).populate("user", "name email");
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Non-admins can only access their own videos
        if (!isAdmin(req.user) && video.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(video);
    } catch (error) {
        console.error("[getVideoById]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Update video status / metadata (owner or admin)
// @route   PUT /api/videos/:id
// @access  Private
export const updateVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        if (!isAdmin(req.user) && video.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updatedVideo = await Video.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json(updatedVideo);
    } catch (error) {
        console.error("[updateVideo]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Delete video (owner or admin)
// @route   DELETE /api/videos/:id
// @access  Private
export const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        if (!isAdmin(req.user) && video.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await video.deleteOne();
        res.json({ message: "Video deleted" });
    } catch (error) {
        console.error("[deleteVideo]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
