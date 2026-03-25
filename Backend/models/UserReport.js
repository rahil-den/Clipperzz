import mongoose from "mongoose";

const userReportSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["report", "feedback", "contact"],
            required: true,
        },
        category: {
            type: String,
            enum: ["bug", "ui", "payment", "feature", "improvement", "other"],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["new", "reviewed", "open", "in-progress", "resolved", "pending", "closed"],
            default: "new",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        replies: [
            {
                admin: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                message: {
                    type: String,
                },
                sentAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

const UserReport = mongoose.model("UserReport", userReportSchema);
export default UserReport;
