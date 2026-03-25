import { Router } from "express";
import { getLogs, clearLogs } from "../controllers/logController.js";
import { protect, admin } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, admin, getLogs);
router.delete("/", protect, admin, clearLogs);

export default router;
