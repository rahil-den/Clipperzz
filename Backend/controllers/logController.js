import AuditLog from "../models/AuditLog.js";

// @desc    Get all audit logs (admin/superadmin)
// @route   GET /api/logs
export const getLogs = async (req, res) => {
    try {
        const { type, adminId, limit = 50, skip = 0 } = req.query;
        const query = {};
        if (type) query.type = type;
        if (adminId) query.admin = adminId;

        const logs = await AuditLog.find(query)
            .populate("admin", "name email role")
            .sort("-createdAt")
            .limit(Number(limit))
            .skip(Number(skip));

        const total = await AuditLog.countDocuments(query);

        res.json({ logs, total, limit: Number(limit), skip: Number(skip) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Create log (internal)
export const createLog = async (logData) => {
    try {
        await AuditLog.create(logData);
    } catch (error) {
        console.error("Error creating audit log:", error.message);
    }
};

// @desc    Clear logs (superadmin)
// @route   DELETE /api/logs
export const clearLogs = async (req, res) => {
    try {
        await AuditLog.deleteMany({});
        res.json({ message: "All logs cleared" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
