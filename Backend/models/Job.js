import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["clip_generation", "video_upload", "export", "thumbnail_generation"],
            required: true,
        },
        status: {
            type: String,
            enum: ["queued", "processing", "completed", "failed"],
            default: "queued",
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        startedAt: {
            type: Date,
        },
        completedAt: {
            type: Date,
        },
        error: {
            type: String,
        },
        metadata: {
            type: Object,
            default: {},
        },
    },
    { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
