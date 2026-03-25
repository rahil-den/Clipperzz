import { Router } from "express";
import { getMySubscription, updateSubscription, getAllSubscriptions } from "../controllers/subscriptionController.js";
import { protect, admin } from "../middleware/auth.js";

const router = Router();

router.get("/me", protect, getMySubscription);
router.get("/", protect, admin, getAllSubscriptions);
router.put("/:id", protect, admin, updateSubscription);

export default router;
