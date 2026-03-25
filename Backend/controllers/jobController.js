import Job from "../models/Job.js";

// @desc    Get all jobs (admin)
// @route   GET /api/jobs
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate("user", "name email").sort("-createdAt");
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Get jobs for current user
// @route   GET /api/jobs/me
export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user._id }).sort("-createdAt");
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Delete job (admin)
// @route   DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        await job.deleteOne();
        res.json({ message: "Job deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Update job status (internal/admin)
// @route   PUT /api/jobs/:id
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
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};
