import { Router } from "express";
import { createVideo, getVideos, getVideoById, updateVideo, deleteVideo } from "../controllers/videoController.js";
import protect from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post("/", createVideo);
router.get("/", getVideos);
router.get("/:id", getVideoById);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

export default router;
