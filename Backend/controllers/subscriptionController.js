import Subscription from "../models/Subscription.js";

// @desc    Get current user's subscription
// @route   GET /api/subscriptions/me
// @access  Private
export const getMySubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ user: req.user._id });
        if (!subscription) {
            return res.status(404).json({ message: "No subscription found" });
        }
        res.json(subscription);
    } catch (error) {
        console.error("[getMySubscription]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get all subscriptions (admin)
// @route   GET /api/subscriptions
// @access  Private / Admin
export const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 });
        res.json(subscriptions);
    } catch (error) {
        console.error("[getAllSubscriptions]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Update subscription (admin)
// @route   PUT /api/subscriptions/:id
// @access  Private / Admin
export const updateSubscription = async (req, res) => {
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
        console.error("[updateSubscription]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Cancel own subscription
// @route   DELETE /api/subscriptions/me
// @access  Private
export const cancelMySubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ user: req.user._id });
        if (!subscription) {
            return res.status(404).json({ message: "No subscription found" });
        }

        subscription.status = "cancelled";
        await subscription.save();

        res.json({ message: "Subscription cancelled", subscription });
    } catch (error) {
        console.error("[cancelMySubscription]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
