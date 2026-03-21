import { Router } from "express";
import { createClip, getClips, getClipById, updateClip, deleteClip } from "../controllers/clipController.js";


const router = Router();



router.post("/", createClip);
router.get("/", getClips);
router.get("/:id", getClipById);
router.put("/:id", updateClip);
router.delete("/:id", deleteClip);

export default router;
