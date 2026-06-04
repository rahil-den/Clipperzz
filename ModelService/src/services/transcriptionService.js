import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import config from '../config/index.js';

const storagePath = path.resolve(config.storagePath);
const scriptPath = path.resolve('scripts/transcribe.py');

/**
 * Transcribe an audio file using Whisper (via Python subprocess).
 * Generates a word-level timestamped transcript and saves it as JSON.
 *
 * @param {string} audioPath - Path to the .wav audio file
 * @param {string} jobId - Unique job identifier
 * @returns {object} - Parsed transcript { text, language, segments[] }
 */
export async function transcribeAudio(audioPath, jobId) {
  const outputPath = path.join(storagePath, 'subtitles', `${jobId}_transcript.json`);
  const modelName = config.whisper.model;

  console.log(`   🎙️ Starting transcription for job: ${jobId}`);
  console.log(`   🎙️ Model: ${modelName} | Audio: ${audioPath}`);

  return new Promise((resolve, reject) => {
    const proc = spawn('python', [
      scriptPath,
      audioPath,
      outputPath,
      '--model', modelName,
    ], {
      shell: true,
      env: {
        ...process.env,
        PYTHONIOENCODING: 'utf-8',
        PYTHONLEGACYWINDOWSSTDIO: 'utf-8',
      },
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      const line = data.toString();
      stdout += line;
      // Forward Python output to Node console
      process.stdout.write(line);
    });

    proc.stderr.on('data', (data) => {
      const line = data.toString();
      stderr += line;
      // Whisper outputs progress to stderr — forward it
      if (line.includes('%|') || line.includes('Detecting') || line.includes('Transcribing')) {
        process.stderr.write(line);
      }
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Whisper transcription failed (exit code ${code}):\n${stderr}`));
      }

      // Read and parse the output JSON
      try {
        if (!fs.existsSync(outputPath)) {
          return reject(new Error(`Transcript file not found: ${outputPath}`));
        }

        const transcript = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
        console.log(`   ✅ Transcription complete: ${transcript.segments.length} segments`);
        resolve(transcript);
      } catch (err) {
        reject(new Error(`Failed to parse transcript JSON: ${err.message}`));
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`Failed to start Whisper process: ${err.message}`));
    });
  });
}

/**
 * Load an existing transcript from disk.
 *
 * @param {string} jobId - Unique job identifier
 * @returns {object|null} - Parsed transcript or null if not found
 */
export function loadTranscript(jobId) {
  const transcriptPath = path.join(storagePath, 'subtitles', `${jobId}_transcript.json`);

  if (!fs.existsSync(transcriptPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(transcriptPath, 'utf-8'));
}
