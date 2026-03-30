import { Router } from "express";
import { getLogs, clearLogs } from "../controllers/logController.js";
import { protect, admin } from "../middleware/auth.js";
import authorize from "../middleware/role.js";

const router = Router();

// Only admins can read logs; only superadmin can wipe them
router.get("/",    protect, admin,                        getLogs);   // GET    /api/logs
router.delete("/", protect, authorize("superadmin"),      clearLogs); // DELETE /api/logs (superadmin only)

export default router;
