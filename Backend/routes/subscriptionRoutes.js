import { Router } from "express";
import { getMySubscription, updateSubscription, getAllSubscriptions } from "../controllers/subscriptionController.js";



const router = Router();

router.get("/me", getMySubscription);
router.get("/", getAllSubscriptions);
router.put("/:id", updateSubscription);

export default router;
