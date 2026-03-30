import UserReport from "../models/UserReport.js";

// @desc    Get all reports (admin)
// @route   GET /api/reports
// @access  Private / Admin
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
            .sort({ createdAt: -1 });

        res.json(reports);
    } catch (error) {
        console.error("[getAllReports]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get current user's own reports
// @route   GET /api/reports/me
// @access  Private
export const getMyReports = async (req, res) => {
    try {
        const reports = await UserReport.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        console.error("[getMyReports]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get single report by ID
// @route   GET /api/reports/:id
// @access  Private
export const getReportById = async (req, res) => {
    try {
        const report = await UserReport.findById(req.params.id)
            .populate("user", "name email")
            .populate("assignedTo", "name email");

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";
        if (!isAdmin && report.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(report);
    } catch (error) {
        console.error("[getReportById]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Create a new report / feedback / contact message
// @route   POST /api/reports
// @access  Private
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
        console.error("[createReport]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Update report status / assignment (admin)
// @route   PUT /api/reports/:id/status
// @access  Private / Admin
export const updateReportStatus = async (req, res) => {
    try {
        const { status, assignedTo, priority } = req.body;

        const report = await UserReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        if (status) report.status = status;
        if (assignedTo) report.assignedTo = assignedTo;
        if (priority) report.priority = priority;

        const updatedReport = await report.save();
        res.json(updatedReport);
    } catch (error) {
        console.error("[updateReportStatus]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Add admin reply to report
// @route   POST /api/reports/:id/reply
// @access  Private / Admin
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

        // Auto-advance status from 'new' → 'reviewed'
        if (report.status === "new") report.status = "reviewed";

        const updatedReport = await report.save();
        res.json(updatedReport);
    } catch (error) {
        console.error("[addReply]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Delete a report (admin or report owner)
// @route   DELETE /api/reports/:id
// @access  Private
export const deleteReport = async (req, res) => {
    try {
        const report = await UserReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";
        if (!isAdmin && report.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await report.deleteOne();
        res.json({ message: "Report deleted" });
    } catch (error) {
        console.error("[deleteReport]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
