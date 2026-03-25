import UserReport from "../models/UserReport.js";

// @desc    Get all user reports (admin)
// @route   GET /api/reports
export const getAllReports = async (req, res) => {
    try {
        const { type, status, priority } = req.query;
        const query = {};
        if (type) query.type = type;
        if (status) query.status = status;
        if (priority) query.priority = priority;

        const reports = await UserReport.find(query)
            .populate("user", "name email")
            .populate("assignedTo", "name email")
            .sort("-createdAt");

        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Create a new report/feedback/contact (user)
// @route   POST /api/reports
export const createReport = async (req, res) => {
    try {
        const { type, category, title, description, priority } = req.body;
        const report = await UserReport.create({
            user: req.user._id,
            type,
            category,
            title,
            description,
            priority: priority || "medium",
        });
        res.status(201).json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Update report status (admin)
// @route   PUT /api/reports/:id/status
export const updateReportStatus = async (req, res) => {
    try {
        const { status, assignedTo } = req.body;
        const report = await UserReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        if (status) report.status = status;
        if (assignedTo) report.assignedTo = assignedTo;

        const updatedReport = await report.save();
        res.json(updatedReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Add reply to report (admin)
// @route   POST /api/reports/:id/reply
export const addReply = async (req, res) => {
    try {
        const { message } = req.body;
        const report = await UserReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        report.replies.push({
            admin: req.user._id,
            message,
            sentAt: new Date(),
        });

        // Automatically mark as reviewed if it was new
        if (report.status === "new") report.status = "reviewed";

        const updatedReport = await report.save();
        res.json(updatedReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
