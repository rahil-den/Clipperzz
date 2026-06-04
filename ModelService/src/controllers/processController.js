import { v4 as uuidv4 } from 'uuid';
import videoQueue from '../queues/videoQueue.js';

/**
 * POST /api/process
 * Accepts a YouTube URL (in body) or an uploaded video file.
 * Adds a job to the BullMQ video processing queue.
 */
export async function create(req, res) {
  try {
    const { url, videoId, userId } = req.body || {};
    const file = req.file;

    // Validate: must provide either a URL or a file
    if (!url && !file) {
      return res.status(400).json({
        error: 'Please provide a YouTube URL or upload a video file.',
      });
    }

    const jobId = uuidv4();

    const jobData = {
      type: url ? 'url' : 'file',
      source: url || file.path,
      originalName: file ? file.originalname : null,
      videoId,
      userId,
    };

    // Add job to the BullMQ queue
    const job = await videoQueue.add('process-video', jobData, {
      jobId,
    });

    console.log(`📋 Job queued: ${job.id} | type: ${jobData.type} | source: ${jobData.source}`);

    return res.status(201).json({
      jobId: job.id,
      status: 'queued',
      message: 'Job created successfully. Processing will begin shortly.',
    });
  } catch (err) {
    console.error('❌ Error creating job:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

/**
 * GET /api/status/:jobId
 * Returns the current status of a processing job by querying BullMQ.
 */
export async function getStatus(req, res) {
  try {
    const { jobId } = req.params;

    const job = await videoQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({
        error: `Job not found: ${jobId}`,
      });
    }

    const state = await job.getState();

    return res.json({
      jobId: job.id,
      status: state,
      progress: job.progress || 0,
      data: job.data,
      result: job.returnvalue || null,
      failedReason: job.failedReason || null,
      timestamps: {
        created: job.timestamp,
        processed: job.processedOn || null,
        finished: job.finishedOn || null,
      },
    });
  } catch (err) {
    console.error('❌ Error fetching job status:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
