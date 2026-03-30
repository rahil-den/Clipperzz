import { Router } from "express";
import {
    createClip,
    getClips,
    getClipById,
    updateClip,
    deleteClip,
    updateClipScore,
    getClipStats,
} from "../controllers/clipController.js";
import { protect, admin } from "../middleware/auth.js";

const router = Router();

// ── Stats (must be before /:id to avoid route conflict) ──────────────────────
router.get("/stats", protect, getClipStats);                      // GET  /api/clips/stats

// ── CRUD ─────────────────────────────────────────────────────────────────────
router.post("/",       protect,         createClip);              // POST /api/clips
router.get("/",        protect,         getClips);                // GET  /api/clips
router.get("/:id",     protect,         getClipById);             // GET  /api/clips/:id
router.put("/:id",     protect,         updateClip);              // PUT  /api/clips/:id
router.delete("/:id",  protect,         deleteClip);              // DELETE /api/clips/:id

// ── Clip Score (admin / AI pipeline) ─────────────────────────────────────────
router.patch("/:id/score", protect, admin, updateClipScore);      // PATCH /api/clips/:id/score

export default router;
