import { Router } from "express";
import { createClip, getClips, getClipById, updateClip, deleteClip } from "../controllers/clipController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, createClip);
router.get("/", protect, getClips);
router.get("/:id", protect, getClipById);
router.put("/:id", protect, updateClip);
router.delete("/:id", protect, deleteClip);

export default router;
