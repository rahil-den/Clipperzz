import { Router } from "express";
import { createVideo, getVideos, getVideoById, updateVideo, deleteVideo } from "../controllers/videoController.js";


const router = Router();



router.post("/", createVideo);
router.get("/", getVideos);
router.get("/:id", getVideoById);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

export default router;
