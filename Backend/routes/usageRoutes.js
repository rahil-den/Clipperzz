import { Router } from "express";
import { getMyUsage, updateUsage, getAllUsage } from "../controllers/usageController.js";
import protect from "../middleware/auth.js";
import authorize from "../middleware/role.js";

const router = Router();

router.get("/me", protect, getMyUsage);
router.get("/", protect, authorize("admin", "superadmin"), getAllUsage);
router.put("/:id", protect, authorize("admin", "superadmin"), updateUsage);

export default router;
