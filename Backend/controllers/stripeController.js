import Stripe from "stripe";
import User from "../models/User.js";
import Subscription from "../models/Subscription.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Helper to determine plan name from price ID
const getPlanFromPriceId = (priceId) => {
    if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
    if (priceId === process.env.STRIPE_PRICE_ENTERPRISE) return "enterprise";
    return "starter";
};

// Monthly USD amount for each plan
const PLAN_AMOUNT = { starter: 0, pro: 29, enterprise: 99 };


// @desc    Create Stripe Checkout Session
// @route   POST /api/stripe/create-checkout-session
// @access  Private
export const createCheckoutSession = async (req, res) => {
    try {
        const { plan } = req.body;

        let priceId;
        if (plan === "pro") priceId = process.env.STRIPE_PRICE_PRO;
        else if (plan === "enterprise") priceId = process.env.STRIPE_PRICE_ENTERPRISE;
        else {
            return res.status(400).json({ message: "Invalid plan selected" });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get or create Stripe Customer
        let customerId = user.stripeCustomerId;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user._id.toString(),
                },
            });
            customerId = customer.id;
            user.stripeCustomerId = customerId;
            await user.save();
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.FRONTEND_URL}/dashboard/billing?success=true`,
            cancel_url: `${process.env.FRONTEND_URL}/dashboard/billing?canceled=true`,
            metadata: {
                userId: user._id.toString(),
            },
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("[createCheckoutSession Error]", error);
        res.status(500).json({ message: error.message || "Failed to create checkout session" });
    }
};

// @desc    Create Stripe Customer Portal Session
// @route   POST /api/stripe/create-portal-session
// @access  Private
export const createPortalSession = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user || !user.stripeCustomerId) {
            return res.status(400).json({ message: "No billing portal available (not a Stripe customer yet)" });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${process.env.FRONTEND_URL}/dashboard/billing`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("[createPortalSession Error]", error);
        res.status(500).json({ message: error.message || "Failed to create portal session" });
    }
};

// @desc    Handle Stripe Webhooks
// @route   POST /api/stripe/webhook
// @access  Public (Called by Stripe)
export const webhookHandler = async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // If testing locally without a webhook secret, we can skip signature verification in dev, 
        // but it is highly recommended to use the Stripe CLI to get the local webhook secret.
        if (endpointSecret) {
            event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
        } else {
            // Fallback for local testing if STRIPE_WEBHOOK_SECRET is not set
            event = req.body;
            console.warn("⚠️ Webhook secret not set. Skipping signature verification (ONLY FOR DEV).");
        }
    } catch (err) {
        console.error("⚠️ Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                if (session.mode === "subscription") {
                    const customerId = session.customer;
                    const subscriptionId = session.subscription;

                    // Fetch the subscription to get price ID
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    const priceId = subscription.items.data[0].price.id;

                    const user = await User.findOne({ stripeCustomerId: customerId });
                    if (user) {
                        let appSubscription = await Subscription.findOne({ user: user._id });
                        if (!appSubscription) {
                            appSubscription = new Subscription({ user: user._id });
                        }

                        const plan1 = getPlanFromPriceId(priceId);
                        appSubscription.stripeSubscriptionId = subscriptionId;
                        appSubscription.stripePriceId = priceId;
                        appSubscription.plan = plan1;
                        appSubscription.amount = PLAN_AMOUNT[plan1] ?? 0;
                        appSubscription.status = subscription.status; // 'active', 'trialing', etc.
                        appSubscription.startDate = new Date(subscription.current_period_start * 1000);
                        appSubscription.endDate = new Date(subscription.current_period_end * 1000);

                        await appSubscription.save();
                        console.log(`[Webhook] Subscription started for user ${user.email} — plan: ${plan1}, amount: $${PLAN_AMOUNT[plan1]}`);
                    }
                }
                break;
            }
            case "customer.subscription.updated": {
                const subscription = event.data.object;
                const customerId = subscription.customer;
                const priceId = subscription.items.data[0].price.id;

                const user = await User.findOne({ stripeCustomerId: customerId });
                if (user) {
                    let appSubscription = await Subscription.findOne({ user: user._id });
                    if (appSubscription) {
                        const plan2 = getPlanFromPriceId(priceId);
                        appSubscription.stripeSubscriptionId = subscription.id;
                        appSubscription.stripePriceId = priceId;
                        appSubscription.plan = plan2;
                        appSubscription.amount = PLAN_AMOUNT[plan2] ?? 0;
                        appSubscription.status = subscription.status;
                        appSubscription.startDate = new Date(subscription.current_period_start * 1000);
                        appSubscription.endDate = new Date(subscription.current_period_end * 1000);

                        await appSubscription.save();
                        console.log(`[Webhook] Subscription updated for user ${user.email} — plan: ${plan2}`);
                    }
                }
                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object;
                const customerId = subscription.customer;

                const user = await User.findOne({ stripeCustomerId: customerId });
                if (user) {
                    let appSubscription = await Subscription.findOne({ user: user._id });
                    if (appSubscription) {
                        appSubscription.status = "expired";
                        appSubscription.plan = "starter";
                        appSubscription.amount = 0;
                        appSubscription.stripeSubscriptionId = null;
                        appSubscription.stripePriceId = null;
                        await appSubscription.save();
                        console.log(`[Webhook] Subscription cancelled for user ${user.email}`);
                    }
                }
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error("[Webhook Processing Error]", error);
        res.status(500).json({ message: "Webhook Processing Error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Sync logged-in user's subscription directly from Stripe API
//          Called by the frontend after a successful Stripe redirect.
//          This works even when webhooks are not configured (local dev).
// @route   POST /api/stripe/sync-subscription
// @access  Private
export const syncMySubscription = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.stripeCustomerId) {
            // No Stripe customer yet — nothing to sync
            return res.status(200).json({ synced: false, message: "No Stripe customer" });
        }

        // Pull all active/trialing subscriptions for this customer from Stripe
        const stripeSubs = await stripe.subscriptions.list({
            customer: user.stripeCustomerId,
            limit: 5,
            expand: ["data.items.data.price"],
        });

        const activeSub = stripeSubs.data.find(
            (s) => s.status === "active" || s.status === "trialing"
        );

        let appSub = await Subscription.findOne({ user: user._id });
        if (!appSub) {
            appSub = new Subscription({ user: user._id });
        }

        if (activeSub) {
            const priceId = activeSub.items.data[0]?.price?.id;
            const plan = getPlanFromPriceId(priceId);

            appSub.stripeSubscriptionId = activeSub.id;
            appSub.stripePriceId = priceId;
            appSub.plan = plan;
            appSub.amount = PLAN_AMOUNT[plan] ?? 0;
            appSub.status = activeSub.status;
            appSub.startDate = new Date(activeSub.current_period_start * 1000);
            appSub.endDate   = new Date(activeSub.current_period_end   * 1000);
        } else {
            // No active subscription on Stripe — mark as free
            appSub.plan   = "starter";
            appSub.amount = 0;
            appSub.status = "expired";
            appSub.stripeSubscriptionId = null;
            appSub.stripePriceId = null;
        }

        await appSub.save();
        console.log(`[SyncSubscription] Synced for user ${user.email} — plan: ${appSub.plan}`);

        res.json({ synced: true, subscription: appSub });
    } catch (error) {
        console.error("[syncMySubscription Error]", error);
        res.status(500).json({ message: error.message || "Sync failed" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Admin: sync ALL users' subscriptions from Stripe
//          Backfills amount/$0 records and fixes any stale starter-plan rows.
// @route   POST /api/stripe/sync-all-subscriptions
// @access  Private / Admin
export const syncAllSubscriptions = async (req, res) => {
    try {
        // Find every user that has a Stripe customer ID
        const users = await User.find({
            stripeCustomerId: { $ne: null, $exists: true },
        }).lean();

        let updated = 0;
        let errors  = 0;

        for (const user of users) {
            try {
                const stripeSubs = await stripe.subscriptions.list({
                    customer: user.stripeCustomerId,
                    limit: 5,
                    expand: ["data.items.data.price"],
                });

                const activeSub = stripeSubs.data.find(
                    (s) => s.status === "active" || s.status === "trialing"
                );

                let appSub = await Subscription.findOne({ user: user._id });
                if (!appSub) appSub = new Subscription({ user: user._id });

                if (activeSub) {
                    const priceId = activeSub.items.data[0]?.price?.id;
                    const plan = getPlanFromPriceId(priceId);

                    appSub.stripeSubscriptionId = activeSub.id;
                    appSub.stripePriceId = priceId;
                    appSub.plan   = plan;
                    appSub.amount = PLAN_AMOUNT[plan] ?? 0;
                    appSub.status = activeSub.status;
                    appSub.startDate = new Date(activeSub.current_period_start * 1000);
                    appSub.endDate   = new Date(activeSub.current_period_end   * 1000);
                } else {
                    appSub.plan   = "starter";
                    appSub.amount = 0;
                    appSub.status = appSub.status === "active" ? "expired" : appSub.status;
                    appSub.stripeSubscriptionId = null;
                    appSub.stripePriceId = null;
                }

                await appSub.save();
                updated++;
            } catch (e) {
                console.error(`[syncAll] Failed for user ${user.email}:`, e.message);
                errors++;
            }
        }

        console.log(`[SyncAll] Done — ${updated} synced, ${errors} errors`);
        res.json({ synced: updated, errors, total: users.length });
    } catch (error) {
        console.error("[syncAllSubscriptions Error]", error);
        res.status(500).json({ message: error.message || "Bulk sync failed" });
    }
};
