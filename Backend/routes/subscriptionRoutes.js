import { Router } from "express";
import { getMySubscription, updateSubscription, getAllSubscriptions } from "../controllers/subscriptionController.js";
import protect from "../middleware/auth.js";
import authorize from "../middleware/role.js";

const router = Router();

router.get("/me", protect, getMySubscription);
router.get("/", protect, authorize("admin", "superadmin"), getAllSubscriptions);
router.put("/:id", protect, authorize("admin", "superadmin"), updateSubscription);

export default router;
