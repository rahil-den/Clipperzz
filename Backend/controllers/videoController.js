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

        // Trigger the AI Model Service worker
        try {
            const modelUrl = process.env.MODEL_SERVICE_URL || 'http://localhost:5001';
            const response = await fetch(`${modelUrl}/api/process`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    url: sourceUrl, 
                    videoId: video._id, 
                    userId: req.user._id 
                })
            });
            const data = await response.json();
            if (data && data.jobId) {
                video.jobId = data.jobId;
                await video.save();
                console.log(`[createVideo] Triggered ModelService for video ${video._id}, jobId: ${data.jobId}`);
            } else {
                console.log(`[createVideo] Triggered ModelService for video ${video._id}, but no jobId returned`);
            }
        } catch (modelErr) {
            console.error(`[createVideo] Failed to trigger ModelService:`, modelErr);
        }

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

        let progressData = null;
        if (video.status === 'processing' && video.jobId) {
            try {
                const modelUrl = process.env.MODEL_SERVICE_URL || 'http://localhost:5001';
                const response = await fetch(`${modelUrl}/api/status/${video.jobId}`);
                if (response.ok) {
                    progressData = await response.json();
                }
            } catch (err) {
                console.error("[getVideoById] Failed to fetch progress from ModelService:", err.message);
            }
        }

        res.json({ ...video.toObject(), progress: progressData });
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

// @desc    Webhook for ModelService to push clips back
// @route   POST /api/videos/webhook
// @access  Public (Internal use)
import Clip from "../models/Clip.js";
export const handleVideoWebhook = async (req, res) => {
    try {
        const { videoId, userId, clips } = req.body;
        
        if (!videoId || !userId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Update Video status to completed
        await Video.findByIdAndUpdate(videoId, { status: "completed" });
        
        // Insert all clips into DB
        if (clips && clips.length > 0) {
            const clipDocs = clips.map((clip, index) => ({
                user: userId,
                video: videoId,
                title: clip.clipName || `Clip ${index + 1}`,
                clipUrl: "http://localhost:5001" + clip.downloadUrl,
                duration: clip.duration || 15,
                platform: ["shorts", "tiktok", "reels"], // Must be array of valid enums
                clipScore: clip.score || Math.floor(Math.random() * (95 - 75 + 1) + 75), // temporary score if none
                status: "ready"
            }));
            
            await Clip.insertMany(clipDocs);
            console.log(`[handleVideoWebhook] Successfully saved ${clips.length} clips for video ${videoId}`);
        }
        
        res.status(200).json({ message: "Clips received and saved." });
    } catch (err) {
        console.error("[handleVideoWebhook]", err);
        res.status(500).json({ message: "Error processing webhook." });
    }
};
