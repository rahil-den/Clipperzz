import Job from "../models/Job.js";

// @desc    Get all jobs (admin)
// @route   GET /api/jobs
// @access  Private / Admin
export const getAllJobs = async (req, res) => {
    try {
        const { status, type } = req.query;
        const query = {};
        if (status) query.status = status;
        if (type) query.type = type;

        const jobs = await Job.find(query)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        console.error("[getAllJobs]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get jobs for current user
// @route   GET /api/jobs/me
// @access  Private
export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error("[getMyJobs]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Create a job (internal / triggered by clip/video processing)
// @route   POST /api/jobs
// @access  Private
export const createJob = async (req, res) => {
    try {
        const { type, metadata } = req.body;

        const job = await Job.create({
            user: req.user._id,
            type,
            metadata: metadata || {},
        });

        res.status(201).json(job);
    } catch (error) {
        console.error("[createJob]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Private
export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate("user", "name email");
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Non-admins can only see their own jobs
        const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";
        if (!isAdmin && job.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(job);
    } catch (error) {
        console.error("[getJobById]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Update job status (admin / internal)
// @route   PUT /api/jobs/:id
// @access  Private / Admin
export const updateJobStatus = async (req, res) => {
    try {
        const { status, progress, error, metadata } = req.body;

        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (status) {
            job.status = status;
            if (status === "processing" && !job.startedAt) job.startedAt = new Date();
            if (status === "completed" || status === "failed") job.completedAt = new Date();
        }
        if (progress !== undefined) job.progress = progress;
        if (error) job.error = error;
        if (metadata) job.metadata = { ...job.metadata, ...metadata };

        const updatedJob = await job.save();
        res.json(updatedJob);
    } catch (error) {
        console.error("[updateJobStatus]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Delete job (admin)
// @route   DELETE /api/jobs/:id
// @access  Private / Admin
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        await job.deleteOne();
        res.json({ message: "Job deleted" });
    } catch (error) {
        console.error("[deleteJob]", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
