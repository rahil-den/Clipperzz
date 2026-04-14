import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        plan: {
            type: String,
            enum: ["starter", "pro", "enterprise"],
            default: "starter",
        },
        status: {
            type: String,
            enum: ["active", "cancelled", "expired"],
            default: "active",
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
        },
        stripeSubscriptionId: {
            type: String,
            default: null,
        },
        stripePriceId: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
