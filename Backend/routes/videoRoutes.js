import { Router } from "express";
import { createVideo, getVideos, getVideoById, updateVideo, deleteVideo, handleVideoWebhook } from "../controllers/videoController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/webhook", handleVideoWebhook);

router.post("/", protect, createVideo);
router.get("/", protect, getVideos);
router.get("/:id", protect, getVideoById);
router.put("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);

export default router;
