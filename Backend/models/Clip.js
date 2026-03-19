import mongoose from "mongoose";

const clipSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Clip title is required"],
            trim: true,
        },
        clipUrl: {
            type: String,
            required: [true, "Clip URL is required"],
        },
        duration: {
            type: Number,
            default: 0,
        },
        platform: {
            type: [String],
            enum: ["reels", "shorts", "tiktok"],
            default: [],
        },
        status: {
            type: String,
            enum: ["processing", "ready", "failed"],
            default: "processing",
        },
    },
    { timestamps: true }
);

const Clip = mongoose.model("Clip", clipSchema);
export default Clip;
