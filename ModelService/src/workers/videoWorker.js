import { Worker } from 'bullmq';
import connection from '../config/redis.js';
import {
  downloadVideo,
  handleUpload,
  normalizeVideo,
  extractAudio,
  processClips,
  renderFinalClips,
} from '../services/videoService.js';
import { transcribeAudio } from '../services/transcriptionService.js';
import { analyzeEngagement, generateCaptions } from '../services/geminiService.js';
import { selectClips } from '../services/clipSelectionService.js';
import { generateSubtitleFiles } from '../services/captionService.js';

/**
 * Video processing worker.
 * Stage 1 (ingestion + preprocessing) is live.
 * Stages 2–6 are stubs — implemented in later steps.
 */
const worker = new Worker(
  'video-processing',
  async (job) => {
    console.log(`\n🎬 Worker picked up job: ${job.id}`);
    console.log(`   Input:`, JSON.stringify(job.data, null, 2));

    const { type, source } = job.data;
    let rawVideoPath;
    const filesToCleanup = [];

    try {
      // ─── Stage 1: Video Ingestion ────────────────────
      await job.updateProgress(5);
      console.log('   📥 Stage 1: Video ingestion...');

      if (type === 'url') {
        rawVideoPath = await downloadVideo(source, job.id);
      } else {
        rawVideoPath = handleUpload(source, job.id);
      }

      // ─── Stage 2: Normalize Video ────────────────────
      await job.updateProgress(15);
      console.log('   🔄 Stage 2: Normalizing video...');

      const normalizedPath = await normalizeVideo(rawVideoPath, job.id);
      filesToCleanup.push(rawVideoPath); // Raw can be cleaned after normalization

      // ─── Stage 3: Extract Audio ──────────────────────
      await job.updateProgress(25);
      console.log('   🎵 Stage 3: Extracting audio...');

      const audioPath = await extractAudio(normalizedPath, job.id);

      // ─── Stage 4: Transcription ──────────────────────
      await job.updateProgress(35);
      console.log('   🎙️ Stage 4: Transcribing audio...');

      const transcript = await transcribeAudio(audioPath, job.id);
      console.log(`   📝 Transcript: ${transcript.segments.length} segments, language: ${transcript.language}`);

      // ─── Stage 5: Content Analysis (Gemini) ──────────
      await job.updateProgress(50);
      console.log('   🧠 Stage 5: Analyzing content with Gemini...');

      const analysis = await analyzeEngagement(transcript);
      console.log(`   📊 Found ${analysis.segments.length} high-engagement segments`);

      // ─── Stage 6: Clip Selection ────────────────────
      await job.updateProgress(65);
      console.log('   ✂️ Stage 6: Selecting best clips...');

      const selectedClips = selectClips(analysis);
      console.log(`   🎬 Selected ${selectedClips.length} clips for rendering`);

      // ─── Stage 7: Video Clipping (cut + vertical) ─────
      await job.updateProgress(70);
      console.log('   🎬 Stage 7: Cutting and converting clips to vertical...');

      const processedClips = await processClips(normalizedPath, selectedClips, job.id);
      console.log(`   ✅ ${processedClips.length} vertical clips rendered`);

      // ─── Stage 8: Caption Generation (Gemini) ────────────
      await job.updateProgress(85);
      console.log('   💬 Stage 8: Generating viral captions...');

      for (const clip of processedClips) {
        const captions = await generateCaptions(transcript, clip.start, clip.end);
        const { assPath, srtPath } = generateSubtitleFiles(captions, job.id, clip.clipName);
        clip.subtitles = { assPath, srtPath };
        clip.captions = captions;
        console.log(`   📝 ${clip.clipName}: ${captions.length} caption lines → .ass + .srt`);
      }

      // ─── Stage 9: Final Rendering (burn subtitles) ────────
      await job.updateProgress(92);
      console.log('   🎞️ Stage 9: Burning subtitles into final clips...');

      const finalClips = await renderFinalClips(processedClips, job.id);

      // ─── Stage 10: Metadata Extraction ─────────────
      let totalDuration = 0;
      try {
        totalDuration = await getVideoDuration(normalizedPath);
      } catch (err) {
        console.warn(`   ⚠️ Failed to get total video duration:`, err.message);
      }

      await job.updateProgress(100);
      console.log(`   ✅ Job ${job.id} completed — ${finalClips.length} clips ready!\n`);

      const resultData = {
        success: true,
        duration: totalDuration,
        clips: finalClips.map((c) => ({
          clipIndex: c.clipIndex,
          clipName: c.clipName,
          start: c.start,
          end: c.end,
          duration: c.duration,
          score: c.score,
          type: c.type,
          finalFilename: c.finalFilename,
          finalPath: c.finalPath,
          downloadUrl: `/api/download/${c.finalFilename}`,
        })),
        message: `Pipeline complete! ${finalClips.length} viral clips with subtitles rendered.`,
      };
      
      // If triggered by the backend, notify it via webhook!
      if (job.data.videoId && job.data.userId) {
          try {
              console.log(`   🌐 Stage 10: Sending webhooks back to backend...`);
              const backendUrl = process.env.BACKEND_URL || 'http://localhost:5002';
              await fetch(`${backendUrl}/api/videos/webhook`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      videoId: job.data.videoId,
                      userId: job.data.userId,
                      duration: resultData.duration,
                      clips: resultData.clips
                  })
              });
              console.log(`   ✅ Webhook sent successfully!`);
          } catch (webhookErr) {
              console.error(`   ❌ Failed to send webhook to backend:`, webhookErr.message);
          }
      }

      return resultData;
    } catch (err) {
      console.error(`   ❌ Job ${job.id} failed at processing:`, err.message);
      throw err;
    }
  },
  {
    connection,
    concurrency: 1,
    stalledInterval: 300000,  // Check for stalled jobs every 5 min (default: 30s)
    maxStalledCount: 3,       // Allow 3 stall recoveries before failing (default: 1)
    lockDuration: 300000,     // Hold job lock for 5 min per stage (default: 30s)
    lockRenewTime: 150000,    // Renew lock every 2.5 min
  }
);

// ─── Worker event listeners ──────────────────────────────
worker.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed:`, result.message);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});

worker.on('progress', (job, progress) => {
  console.log(`📊 Job ${job.id} progress: ${progress}%`);
});

console.log('👷 Video processing worker started');

export default worker;
