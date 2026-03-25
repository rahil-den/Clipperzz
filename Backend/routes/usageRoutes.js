import { Router } from "express";
import { getMyUsage, updateUsage, getAllUsage } from "../controllers/usageController.js";
import { protect, admin } from "../middleware/auth.js";

const router = Router();

router.get("/me", protect, getMyUsage);
router.get("/", protect, admin, getAllUsage);
router.put("/:id", protect, admin, updateUsage);

export default router;
