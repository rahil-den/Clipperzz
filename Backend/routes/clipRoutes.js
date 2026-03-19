import { Router } from "express";
import { createClip, getClips, getClipById, updateClip, deleteClip } from "../controllers/clipController.js";
import protect from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post("/", createClip);
router.get("/", getClips);
router.get("/:id", getClipById);
router.put("/:id", updateClip);
router.delete("/:id", deleteClip);

export default router;
