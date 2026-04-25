import { Router } from "express";
import {
    getMySubscription,
    getMySubscriptionHistory,
    getAllSubscriptions,
    updateSubscription,
    cancelMySubscription,
} from "../controllers/subscriptionController.js";
import { protect, admin } from "../middleware/auth.js";

const router = Router();

router.get("/me/history", protect, getMySubscriptionHistory); // GET    /api/subscriptions/me/history
router.get("/me",         protect, getMySubscription);        // GET    /api/subscriptions/me
router.delete("/me",      protect, cancelMySubscription);     // DELETE /api/subscriptions/me
router.get("/",           protect, admin, getAllSubscriptions);// GET    /api/subscriptions      (admin)
router.put("/:id",        protect, admin, updateSubscription);// PUT    /api/subscriptions/:id  (admin)

export default router;

