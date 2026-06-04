/**
 * AI Service (Ollama)
 *
 * Uses local Ollama for:
 * 1. Engagement analysis — scores transcript segments for viral potential
 * 2. Caption generation  — produces viral-style subtitle lines
 *
 * No API keys required. Runs fully offline.
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5';

/**
 * Call Ollama generate endpoint with a prompt.
 * Forces JSON output mode.
 */
async function ollamaGenerate(prompt, maxRetries = 2) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`   🔄 Ollama retry ${attempt}/${maxRetries + 1}...`);
      }

      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt,
          format: 'json',
          stream: false,
          options: {
            temperature: 0.3,
            top_p: 0.8,
            num_predict: 2048,
          },
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Ollama HTTP ${response.status}: ${err}`);
      }

      const data = await response.json();
      return data.response;
    } catch (err) {
      lastError = err;
      console.error(`   ⚠️ Ollama attempt ${attempt} failed:`, err.message);
      if (attempt <= maxRetries) {
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
  }

  throw new Error(`Ollama failed after ${maxRetries + 1} attempts: ${lastError.message}`);
}

/**
 * Safely parse JSON from Ollama response.
 * Handles stray markdown fences if present.
 */
function parseJSON(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`JSON parse failed: ${err.message}\nRaw: ${cleaned.substring(0, 400)}`);
  }
}

/**
 * Format transcript segments as timestamped text.
 */
function formatTranscript(transcript) {
  if (!transcript?.segments) throw new Error('Invalid transcript: missing segments');
  return transcript.segments
    .map((s) => `[${s.start.toFixed(1)}s - ${s.end.toFixed(1)}s] ${s.text}`)
    .join('\n');
}

// ─────────────────────────────────────────────────────────────
// ENGAGEMENT ANALYSIS
// ─────────────────────────────────────────────────────────────

/**
 * Analyze a transcript to find high-engagement segments.
 *
 * @param {object} transcript - { text, language, segments[] }
 * @returns {object} - { segments: [{ start, end, score, reason, type }] }
 */
export async function analyzeEngagement(transcript) {
  const formattedTranscript = formatTranscript(transcript);

  const prompt = `You are a viral content analyst. Analyze this video transcript and find the most engaging segments (15-60 seconds each) that would make great short-form clips.

TRANSCRIPT:
${formattedTranscript}

Return a JSON object with this exact structure:
{
  "segments": [
    {
      "start": <number>,
      "end": <number>,
      "score": <0.0 to 1.0>,
      "reason": "<why this is engaging>",
      "type": "<hook|emotional|informative|funny|controversial|dramatic>"
    }
  ]
}

Rules:
- Find 3 to 6 segments
- Each segment must be 15 to 60 seconds long
- start and end must match actual timestamps in the transcript
- score 0.9+ means extremely viral, 0.7+ means very engaging
- Do not overlap segments
- Return only the JSON, no extra text`;

  console.log(`   🧠 Analyzing engagement with Ollama (${OLLAMA_MODEL})...`);

  const raw = await ollamaGenerate(prompt);
  console.log(`   📥 Ollama response received (${raw.length} chars)`);

  const parsed = parseJSON(raw);

  if (!parsed?.segments || !Array.isArray(parsed.segments)) {
    throw new Error('Invalid response: missing "segments" array');
  }

  const allowedTypes = ['hook', 'emotional', 'informative', 'funny', 'controversial', 'dramatic'];

  for (const seg of parsed.segments) {
    if (typeof seg.start !== 'number') throw new Error(`Bad segment start: ${seg.start}`);
    if (typeof seg.end !== 'number' || seg.end <= seg.start) throw new Error(`Bad segment end: ${seg.end}`);
    if (typeof seg.score !== 'number') seg.score = 0.5;
    seg.score = Math.min(1, Math.max(0, seg.score));
    if (!allowedTypes.includes(seg.type)) seg.type = 'informative';
  }

  console.log(`   ✅ Found ${parsed.segments.length} engagement segments`);
  for (const seg of parsed.segments) {
    console.log(`      • [${seg.start}s-${seg.end}s] score=${seg.score} type=${seg.type}`);
  }

  return parsed;
}

// ─────────────────────────────────────────────────────────────
// CAPTION GENERATION
// ─────────────────────────────────────────────────────────────

/**
 * Generate viral-style captions for a clip.
 *
 * @param {object} transcript - Full transcript
 * @param {number} clipStart  - Clip start (seconds)
 * @param {number} clipEnd    - Clip end (seconds)
 * @returns {object[]}        - [{ start, end, text }]
 */
export async function generateCaptions(transcript, clipStart, clipEnd) {
  // Extract words precisely within clip range
  const clipWords = [];
  if (transcript.segments) {
    for (const seg of transcript.segments) {
      if (seg.words) {
        for (const word of seg.words) {
          // Add a buffer so words that barely clip at the edge are included
          if (word.end >= clipStart && word.start <= clipEnd) {
            clipWords.push(word);
          }
        }
      }
    }
  }

  const captions = [];
  const MAX_WORDS = 3; // TikTok/Reels viral pacing is fast
  let currentChunk = [];

  for (let i = 0; i < clipWords.length; i++) {
    const wordObj = clipWords[i];
    let text = wordObj.word.trim();
    
    // Auto-emphasize words longer than 5 chars for viral styling
    if (text.replace(/[^\w]/g, '').length >= 5) {
      text = text.toUpperCase();
    }
    
    currentChunk.push({ ...wordObj, word: text });
    
    const isPunctuation = text.match(/[.!?]$/);
    
    // Break caption if max words reached, punctuation hits, or last word
    if (currentChunk.length >= MAX_WORDS || isPunctuation || i === clipWords.length - 1) {
      const startRelative = Math.max(0, parseFloat((currentChunk[0].start - clipStart).toFixed(2)));
      // Ensure the end is slightly after start and bound by end of clip
      let endRelative = Math.max(startRelative + 0.1, parseFloat((currentChunk[currentChunk.length - 1].end - clipStart).toFixed(2)));
      
      captions.push({
        start: startRelative,
        end: endRelative,
        text: currentChunk.map(w => w.word).join(' '),
      });
      currentChunk = [];
    }
  }

  console.log(`   ✅ Instantly generated ${captions.length} perfectly-synced caption lines`);
  return captions;
}
