import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Video title is required"],
            trim: true,
        },
        sourceType: {
            type: String,
            enum: ["youtube", "upload"],
            required: true,
        },
        sourceUrl: {
            type: String,
            required: [true, "Source URL is required"],
        },
        duration: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["processing", "completed", "failed"],
            default: "processing",
        },
        jobId: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);
export default Video;
