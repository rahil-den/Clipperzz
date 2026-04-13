import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        emailVerificationToken: {
            type: String,
            required: true,
        },
        emailVerificationExpires: {
            type: Date,
            required: true,
            index: { expires: 0 }, // TTL index — MongoDB auto-deletes when this date passes
        },
    },
    { timestamps: true }
);

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);
export default PendingUser;
