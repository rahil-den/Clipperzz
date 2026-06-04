import path from 'path';
import fs from 'fs';
import config from '../config/index.js';

const storagePath = path.resolve(config.storagePath);

/**
 * Convert seconds to ASS timestamp format: H:MM:SS.CC
 */
function toASSTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const cs = Math.round((seconds % 1) * 100);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

/**
 * Generate an ASS subtitle file with viral-style formatting.
 *
 * Features:
 * - Bold white text with black outline
 * - Large font centered at bottom
 * - Uppercase emphasis words styled differently
 *
 * @param {object[]} captions - Array of { start, end, text }
 * @param {string} outputPath - Path for the .ass file
 * @returns {string} - Path to the generated .ass file
 */
export function generateASSFile(captions, outputPath) {
  const header = `[Script Info]
Title: Clipperz Viral Captions
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial Black,86,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,6,3,2,60,60,400,1
Style: Emphasis,Arial Black,86,&H0000FFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,6,3,2,60,60,400,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  const events = captions.map((cap) => {
    // Process text: apply emphasis style to UPPERCASE words
    const processedText = processViralText(cap.text);
    const start = toASSTime(cap.start);
    const end = toASSTime(cap.end);

    return `Dialogue: 0,${start},${end},Default,,0,0,0,,${processedText}`;
  });

  const content = header + events.join('\n') + '\n';

  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`   📝 ASS subtitle saved: ${outputPath}`);

  return outputPath;
}

/**
 * Process text for viral subtitle styling.
 * UPPERCASE words get yellow color emphasis via ASS override tags.
 */
function processViralText(text) {
  // Enclose entirely uppercase words (length >= 2, only letters) in yellow emphasis
  // We use {\c&H00FFFF&} for yellow and {\c&HFFFFFF&} for white.
  return text.replace(/\b([A-Z]{2,})\b/g, '{\\c&H00FFFF&}$1{\\c&HFFFFFF&}');
}

/**
 * Convert seconds to SRT timestamp format: HH:MM:SS,mmm
 */
function toSRTTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

/**
 * Generate an SRT subtitle file (simpler format, for compatibility).
 *
 * @param {object[]} captions - Array of { start, end, text }
 * @param {string} outputPath - Path for the .srt file
 * @returns {string} - Path to the generated .srt file
 */
export function generateSRTFile(captions, outputPath) {
  const lines = captions.map((cap, i) => {
    return `${i + 1}\n${toSRTTime(cap.start)} --> ${toSRTTime(cap.end)}\n${cap.text}\n`;
  });

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
  console.log(`   📝 SRT subtitle saved: ${outputPath}`);

  return outputPath;
}

/**
 * Generate subtitle files for a clip.
 *
 * @param {object[]} captions - Caption objects from Gemini
 * @param {string} jobId - Job identifier
 * @param {string} clipName - Clip name (e.g., clip_1)
 * @returns {object} - Paths to generated subtitle files { assPath, srtPath }
 */
export function generateSubtitleFiles(captions, jobId, clipName) {
  const assPath = path.join(storagePath, 'subtitles', `${jobId}_${clipName}.ass`);
  const srtPath = path.join(storagePath, 'subtitles', `${jobId}_${clipName}.srt`);

  generateASSFile(captions, assPath);
  generateSRTFile(captions, srtPath);

  return { assPath, srtPath };
}
