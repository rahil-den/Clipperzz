import Subscription from "../models/Subscription.js";

// @desc    Get current user's subscription
// @route   GET /api/subscriptions/me
export const getMySubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOne({ user: req.user._id });
        if (!subscription) {
            return res.status(404).json({ message: "No subscription found" });
        }
        res.json(subscription);
    } catch (error) {
        next(error);
    }
};

// @desc    Update subscription (admin or system)
// @route   PUT /api/subscriptions/:id
export const updateSubscription = async (req, res, next) => {
    try {
        const { plan, status, startDate, endDate } = req.body;

        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        if (plan) subscription.plan = plan;
        if (status) subscription.status = status;
        if (startDate) subscription.startDate = startDate;
        if (endDate) subscription.endDate = endDate;

        const updated = await subscription.save();
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all subscriptions (admin)
// @route   GET /api/subscriptions
export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find().populate("user", "name email");
        res.json(subscriptions);
    } catch (error) {
        next(error);
    }
};
