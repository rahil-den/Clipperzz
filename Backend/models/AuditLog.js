import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        target: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["user", "system", "admin", "content", "payment"],
            required: true,
        },
        details: {
            type: String,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
