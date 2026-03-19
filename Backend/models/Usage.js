import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        videosProcessed: {
            type: Number,
            default: 0,
        },
        clipsGenerated: {
            type: Number,
            default: 0,
        },
        monthlyLimit: {
            type: Number,
            default: 10,
        },
        resetDate: {
            type: Date,
            default: () => {
                const now = new Date();
                return new Date(now.getFullYear(), now.getMonth() + 1, 1);
            },
        },
    },
    { timestamps: true }
);

const Usage = mongoose.model("Usage", usageSchema);
export default Usage;
