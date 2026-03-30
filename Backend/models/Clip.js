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
        // ── Clip Score ─────────────────────────────────────────────────────
        // AI-generated virality / quality score (0–100).
        // Null until the processing job completes analysis.
        clipScore: {
            type: Number,
            default: null,
            min: 0,
            max: 100,
        },
        // Optional score breakdown returned by the AI pipeline
        scoreBreakdown: {
            hook:        { type: Number, default: null }, // 0-100
            pacing:      { type: Number, default: null },
            retention:   { type: Number, default: null },
            virality:    { type: Number, default: null },
        },
        // Human-readable AI insight text
        aiInsight: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

// Index for fast user-based queries
clipSchema.index({ user: 1, createdAt: -1 });

const Clip = mongoose.model("Clip", clipSchema);
export default Clip;
