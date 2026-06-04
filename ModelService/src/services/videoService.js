import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import config from '../config/index.js';

const storagePath = path.resolve(config.storagePath);

/**
 * Execute a command as a promise.
 * Streams stdout/stderr and resolves when the process exits.
 */
function execCommand(command, args, label = '') {
  return new Promise((resolve, reject) => {
    console.log(`   🔧 [${label}] Running: ${command} ${args.join(' ')}`);

    const proc = spawn(command, args, { shell: false });
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`[${label}] Process exited with code ${code}\n${stderr}`));
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`[${label}] Failed to start process: ${err.message}`));
    });
  });
}

/**
 * Download a video from a URL using yt-dlp.
 * Saves the video to /storage/uploads/<jobId>.mp4
 *
 * @param {string} url - YouTube or video URL
 * @param {string} jobId - Unique job identifier
 * @returns {string} - Path to the downloaded video
 */
export async function downloadVideo(url, jobId) {
  const outputPath = path.join(storagePath, 'uploads', `${jobId}.mp4`);

  const baseArgs = [
    // Permissive format: try mp4 first, fall back to anything then remux to mp4
    '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best',
    '--merge-output-format', 'mp4',
    '--remux-video', 'mp4',
    '-o', outputPath,
    '--no-playlist',
    '--no-warnings',
    '--no-check-certificates',
    '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  ];

  // Try resilient mobile player clients
  let extractorArgs = 'youtube:player_client=android,ios';

  // Support for PO-Token (Proof of Origin) to bypass BotGuard
  const poToken = process.env.YOUTUBE_PO_TOKEN;
  const visitorData = process.env.YOUTUBE_VISITOR_DATA;
  
  if (poToken && visitorData) {
    extractorArgs += `;po_token=${poToken};visitor_data=${visitorData}`;
  }

  baseArgs.push('--extractor-args', extractorArgs);

  // Prepare cookies if available
  const cookiesPath = process.env.YOUTUBE_COOKIES_PATH
    ? path.resolve(process.env.YOUTUBE_COOKIES_PATH)
    : null;

  console.log(`   📥 Downloading video from: ${url}`);

  try {
    const primaryArgs = [...baseArgs];
    if (cookiesPath && fs.existsSync(cookiesPath)) {
      primaryArgs.push('--cookies', cookiesPath);
      console.log(`   🍪 Using cookies from: ${cookiesPath}`);
    }
    primaryArgs.push(url);

    await execCommand('yt-dlp', primaryArgs, 'yt-dlp');
  } catch (err) {
    // FALLBACK STRATEGY: 
    // If extraction fails with cookies (common BotGuard trigger), retry WITHOUT cookies.
    if (err.message.includes('No video formats found!') && cookiesPath) {
      console.warn(`   ⚠️ BotGuard block detected (cookies triggered it). Retrying WITHOUT cookies...`);
      const fallbackArgs = [...baseArgs, url];
      await execCommand('yt-dlp', fallbackArgs, 'yt-dlp-fallback');
    } else {
      throw err;
    }
  }

  console.log(`   ✅ Downloaded to: ${outputPath}`);

  if (!fs.existsSync(outputPath)) {
    throw new Error(`Download failed — file not found: ${outputPath}`);
  }

  return outputPath;
}

/**
 * Handle uploaded files.
 * The file is already saved by multer to /storage/uploads.
 * We rename it to use the jobId for consistency.
 *
 * @param {string} uploadedPath - Path where multer saved the file
 * @param {string} jobId - Unique job identifier
 * @returns {string} - Path to the renamed video
 */
export function handleUpload(uploadedPath, jobId) {
  const ext = path.extname(uploadedPath) || '.mp4';
  const newPath = path.join(storagePath, 'uploads', `${jobId}${ext}`);

  // Rename to job-based filename if different
  if (uploadedPath !== newPath) {
    fs.renameSync(uploadedPath, newPath);
    console.log(`   📂 Renamed upload: ${uploadedPath} → ${newPath}`);
  }

  return newPath;
}

/**
 * Normalize a video using FFmpeg.
 * Ensures consistent codec, resolution, and format for processing.
 * Output: /storage/uploads/<jobId>_normalized.mp4
 *
 * @param {string} inputPath - Path to the raw video
 * @param {string} jobId - Unique job identifier
 * @returns {string} - Path to the normalized video
 */
export async function normalizeVideo(inputPath, jobId) {
  const outputPath = path.join(storagePath, 'uploads', `${jobId}_normalized.mp4`);

  const args = [
    '-i', inputPath,
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '18',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', '44100',
    '-ac', '2',
    '-movflags', '+faststart',
    '-y',               // Overwrite output
    outputPath,
  ];

  console.log(`   🔄 Normalizing video...`);
  await execCommand('ffmpeg', args, 'normalize');
  console.log(`   ✅ Normalized to: ${outputPath}`);

  // Verify output exists
  if (!fs.existsSync(outputPath)) {
    throw new Error(`Normalization failed — file not found: ${outputPath}`);
  }

  return outputPath;
}

/**
 * Extract audio from a video using FFmpeg.
 * Output: /storage/audio/<jobId>.wav (16kHz mono — optimal for Whisper)
 *
 * @param {string} videoPath - Path to the normalized video
 * @param {string} jobId - Unique job identifier
 * @returns {string} - Path to the extracted audio file
 */
export async function extractAudio(videoPath, jobId) {
  const outputPath = path.join(storagePath, 'audio', `${jobId}.wav`);

  const args = [
    '-i', videoPath,
    '-vn',              // No video
    '-acodec', 'pcm_s16le',
    '-ar', '16000',     // 16kHz sample rate (Whisper optimal)
    '-ac', '1',         // Mono
    '-y',               // Overwrite output
    outputPath,
  ];

  console.log(`   🎵 Extracting audio...`);
  await execCommand('ffmpeg', args, 'extract-audio');
  console.log(`   ✅ Audio saved to: ${outputPath}`);

  // Verify output exists
  if (!fs.existsSync(outputPath)) {
    throw new Error(`Audio extraction failed — file not found: ${outputPath}`);
  }

  return outputPath;
}

/**
 * Get video duration in seconds using ffprobe.
 *
 * @param {string} videoPath - Path to video file
 * @returns {number} - Duration in seconds
 */
export async function getVideoDuration(videoPath) {
  const args = [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    videoPath,
  ];

  const { stdout } = await execCommand('ffprobe', args, 'duration');
  const duration = parseFloat(stdout.trim());

  if (isNaN(duration)) {
    throw new Error(`Could not determine video duration for: ${videoPath}`);
  }

  console.log(`   ⏱️ Video duration: ${duration.toFixed(2)}s`);
  return duration;
}

/**
 * Cut a clip from the source video using FFmpeg.
 *
 * @param {string} inputPath - Path to the normalized video
 * @param {number} start - Start time in seconds
 * @param {number} end - End time in seconds
 * @param {string} outputPath - Path for the output clip
 * @returns {string} - Path to the cut clip
 */
export async function cutClip(inputPath, start, end, outputPath) {
  const duration = end - start;

  const args = [
    '-ss', start.toString(),
    '-i', inputPath,
    '-t', duration.toString(),
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '18',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-avoid_negative_ts', 'make_zero',
    '-movflags', '+faststart',
    '-y',
    outputPath,
  ];

  console.log(`   ✂️ Cutting clip: ${start.toFixed(1)}s → ${end.toFixed(1)}s (${duration.toFixed(1)}s)`);
  await execCommand('ffmpeg', args, 'cut-clip');

  if (!fs.existsSync(outputPath)) {
    throw new Error(`Clip cut failed — file not found: ${outputPath}`);
  }

  return outputPath;
}

/**
 * Convert a clip to vertical (9:16) format.
 * Uses a blurred, scaled background with the original video centered on top.
 *
 * @param {string} inputPath - Path to the horizontal clip
 * @param {string} outputPath - Path for the vertical output
 * @returns {string} - Path to the vertical clip
 */
export async function convertToVertical(inputPath, outputPath) {
  // 9:16 vertical — 1080x1920
  // Strategy: blurred scaled background + centered original
  const filterComplex = [
    // Create blurred background scaled to 1080x1920
    '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:5[bg];',
    // Scale original to fit width, maintaining aspect ratio
    '[0:v]scale=1080:-2:force_original_aspect_ratio=decrease[fg];',
    // Overlay centered
    '[bg][fg]overlay=(W-w)/2:(H-h)/2[out]',
  ].join('');

  const args = [
    '-i', inputPath,
    '-filter_complex', filterComplex,
    '-map', '[out]',
    '-map', '0:a?',
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '18',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-movflags', '+faststart',
    '-y',
    outputPath,
  ];

  console.log(`   📐 Converting to vertical (9:16)...`);
  await execCommand('ffmpeg', args, 'vertical');

  if (!fs.existsSync(outputPath)) {
    throw new Error(`Vertical conversion failed — file not found: ${outputPath}`);
  }

  return outputPath;
}

/**
 * Process all selected clips: cut + convert to vertical.
 *
 * @param {string} videoPath - Path to the normalized source video
 * @param {object[]} selectedClips - Clips from clipSelectionService
 * @param {string} jobId - Unique job identifier
 * @returns {object[]} - Clips with output paths added
 */
export async function processClips(videoPath, selectedClips, jobId) {
  const results = [];

  for (const clip of selectedClips) {
    const clipName = clip.clipName || `clip_${clip.clipIndex}`;
    const cutPath = path.join(storagePath, 'temp', `${jobId}_${clipName}_cut.mp4`);
    const verticalPath = path.join(storagePath, 'processed', `${jobId}_${clipName}.mp4`);

    console.log(`\n   🎬 Processing ${clipName} [${clip.start}s – ${clip.end}s]`);

    // Step 1: Cut the clip
    await cutClip(videoPath, clip.start, clip.end, cutPath);

    // Step 2: Convert to vertical
    await convertToVertical(cutPath, verticalPath);

    // Clean up temp cut file
    cleanupFiles([cutPath]);

    results.push({
      ...clip,
      outputPath: verticalPath,
      filename: `${jobId}_${clipName}.mp4`,
    });

    console.log(`   ✅ ${clipName} ready: ${verticalPath}`);
  }

  return results;
}

/**
 * Burn ASS subtitles into a video using FFmpeg.
 *
 * @param {string} videoPath - Path to the vertical video clip
 * @param {string} assPath - Path to the .ass subtitle file
 * @param {string} outputPath - Path for the final output
 * @returns {string} - Path to the rendered video with subtitles
 */
export async function burnSubtitles(videoPath, assPath, outputPath) {
  // FFmpeg ass filter needs forward slashes and escaped colons on Windows
  const escapedAssPath = assPath
    .replace(/\\/g, '/')
    .replace(/:/g, '\\:');

  const args = [
    '-i', videoPath,
    '-vf', `ass='${escapedAssPath}'`,
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '18',
    '-c:a', 'copy',
    '-movflags', '+faststart',
    '-y',
    outputPath,
  ];

  console.log(`   🔥 Burning subtitles into video...`);
  await execCommand('ffmpeg', args, 'burn-subs');

  if (!fs.existsSync(outputPath)) {
    throw new Error(`Subtitle burn-in failed — file not found: ${outputPath}`);
  }

  return outputPath;
}

/**
 * Render final clips with burned-in subtitles.
 *
 * @param {object[]} clips - Processed clips with subtitle paths
 * @param {string} jobId - Job identifier
 * @returns {object[]} - Clips with final output paths
 */
export async function renderFinalClips(clips, jobId) {
  const results = [];

  for (const clip of clips) {
    const clipName = clip.clipName || `clip_${clip.clipIndex}`;
    const finalPath = path.join(storagePath, 'processed', `${jobId}_${clipName}_final.mp4`);

    console.log(`\n   🎞️ Rendering final ${clipName}...`);

    if (clip.subtitles && clip.subtitles.assPath) {
      // Burn subtitles into video
      await burnSubtitles(clip.outputPath, clip.subtitles.assPath, finalPath);

      // Clean up the pre-subtitle vertical clip
      cleanupFiles([clip.outputPath]);
    } else {
      // No subtitles — just rename the existing clip as final
      fs.renameSync(clip.outputPath, finalPath);
      console.log(`   📦 No subtitles — renamed to final: ${finalPath}`);
    }

    results.push({
      ...clip,
      finalPath,
      finalFilename: `${jobId}_${clipName}_final.mp4`,
    });

    console.log(`   ✅ ${clipName} final render complete`);
  }

  return results;
}

/**
 * Clean up temporary files for a job.
 *
 * @param {string[]} filePaths - Paths to clean up
 */
export function cleanupFiles(filePaths) {
  for (const filePath of filePaths) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`   🗑️ Cleaned up: ${filePath}`);
      }
    } catch (err) {
      console.warn(`   ⚠️ Failed to clean up ${filePath}: ${err.message}`);
    }
  }
}
