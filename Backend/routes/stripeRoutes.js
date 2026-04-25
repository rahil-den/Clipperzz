import { Router } from "express";
import {
    createCheckoutSession,
    createPortalSession,
    webhookHandler,
    syncMySubscription,
    syncAllSubscriptions,
} from "../controllers/stripeController.js";
import { protect, admin } from "../middleware/auth.js";
import express from "express";

const router = Router();

// Endpoint for Stripe checkout session creation
router.post("/create-checkout-session", protect, express.json(), createCheckoutSession);

// Endpoint for Stripe Billing Portal
router.post("/create-portal-session", protect, express.json(), createPortalSession);

// Sync current user's subscription directly from Stripe (webhook-free)
router.post("/sync-subscription", protect, express.json(), syncMySubscription);

// Admin: sync ALL users' subscriptions from Stripe (backfill $0 records)
router.post("/sync-all-subscriptions", protect, admin, express.json(), syncAllSubscriptions);

// Endpoint for Webhooks (Notice it does NOT use 'protect')
// In server.js we will configure this route to receive raw JSON
router.post(
    "/webhook",
    express.raw({ type: "application/json" }), // Stripe needs the raw body
    webhookHandler
);

export default router;

