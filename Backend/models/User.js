import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
            default: null,
        },
        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local",
        },
        role: {
            type: String,
            enum: ["user", "premium", "pro", "admin", "superadmin"],
            default: "user",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        countryCode: {
            type: String,
            default: "+91",
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
            default: null,
        },
        stripeCustomerId: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

// Hide superadmin from normal queries (lists, etc.)
userSchema.pre(/^find/, function () {
    const query = this.getQuery();
    // Allow if searching by specific email or ID
    if (query._id || query.email) return;

    if (!query.role || query.role !== "superadmin") {
        this.where({ role: { $ne: "superadmin" } });
    }
});

// Strip password from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model("User", userSchema);
export default User;
