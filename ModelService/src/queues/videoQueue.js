import { Queue } from 'bullmq';
import connection from '../config/redis.js';

/**
 * Video processing queue.
 * Jobs are added here from the /api/process endpoint
 * and consumed by the worker in src/workers/videoWorker.js.
 */
const videoQueue = new Queue('video-processing', {
  connection,
  defaultJobOptions: {
    attempts: 1,        // No retries — fail fast, user can resubmit
    removeOnComplete: true,
    removeOnFail: true, // Auto-clean failed jobs from Redis
  },
});

console.log('📦 Video processing queue initialized');

export default videoQueue;
