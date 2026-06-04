/**
 * Clip Selection Service
 *
 * Takes engagement-scored segments from Gemini and selects
 * the best 3–4 non-overlapping clips for final rendering.
 */

const MIN_CLIP_DURATION = 15;  // seconds
const MAX_CLIP_DURATION = 60;  // seconds
const MAX_CLIPS = 4;
const MIN_CLIPS = 1;
const MERGE_GAP_THRESHOLD = 3; // seconds — merge segments within this gap

/**
 * Check if two segments overlap.
 */
function segmentsOverlap(a, b) {
  return a.start < b.end && b.start < a.end;
}

/**
 * Check if two segments are close enough to merge.
 */
function segmentsAreClose(a, b) {
  const gap = Math.abs(a.end - b.start);
  return gap <= MERGE_GAP_THRESHOLD;
}

/**
 * Merge two overlapping or close segments.
 * Takes the higher score and combines reasons.
 */
function mergeSegments(a, b) {
  return {
    start: Math.min(a.start, b.start),
    end: Math.max(a.end, b.end),
    score: Math.max(a.score, b.score),
    reason: a.score >= b.score ? a.reason : b.reason,
    type: a.score >= b.score ? a.type : b.type,
    merged: true,
  };
}

/**
 * Adjust segment duration to fit within MIN/MAX constraints.
 * Expands short segments and trims long ones.
 *
 * @param {object} segment - { start, end, ... }
 * @param {number} videoDuration - Total video duration in seconds
 * @returns {object} - Adjusted segment
 */
function adjustDuration(segment, videoDuration) {
  let { start, end } = segment;
  let duration = end - start;

  // If too short, try to expand equally from both sides
  if (duration < MIN_CLIP_DURATION) {
    const needed = MIN_CLIP_DURATION - duration;
    const expandEach = needed / 2;

    start = Math.max(0, start - expandEach);
    end = Math.min(videoDuration, end + expandEach);

    // If one side hit a boundary, expand more from the other
    duration = end - start;
    if (duration < MIN_CLIP_DURATION) {
      if (start === 0) {
        end = Math.min(videoDuration, start + MIN_CLIP_DURATION);
      } else {
        start = Math.max(0, end - MIN_CLIP_DURATION);
      }
    }
  }

  // If too long, trim from the end (keep the hook/start)
  if (end - start > MAX_CLIP_DURATION) {
    end = start + MAX_CLIP_DURATION;
  }

  return {
    ...segment,
    start: Math.round(start * 100) / 100,
    end: Math.round(end * 100) / 100,
    duration: Math.round((end - start) * 100) / 100,
  };
}

/**
 * Remove overlapping segments, keeping the higher-scored one.
 *
 * @param {object[]} segments - Sorted by score (descending)
 * @returns {object[]} - Non-overlapping segments
 */
function removeOverlaps(segments) {
  const selected = [];

  for (const seg of segments) {
    const hasOverlap = selected.some((s) => segmentsOverlap(s, seg));
    if (!hasOverlap) {
      selected.push(seg);
    }
  }

  return selected;
}

/**
 * Merge adjacent or nearly-adjacent segments.
 *
 * @param {object[]} segments - Sorted by start time
 * @returns {object[]} - Merged segments
 */
function mergeCloseSegments(segments) {
  if (segments.length <= 1) return segments;

  // Sort by start time for merging
  const sorted = [...segments].sort((a, b) => a.start - b.start);
  const merged = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];

    if (segmentsOverlap(last, current) || segmentsAreClose(last, current)) {
      // Merge — but only if combined duration stays within limit
      const combinedDuration = Math.max(last.end, current.end) - Math.min(last.start, current.start);
      if (combinedDuration <= MAX_CLIP_DURATION) {
        merged[merged.length - 1] = mergeSegments(last, current);
      }
      // If combined would be too long, keep both separate
    } else {
      merged.push(current);
    }
  }

  return merged;
}

/**
 * Select the best clips from Gemini engagement analysis.
 *
 * Pipeline:
 * 1. Merge close/overlapping segments
 * 2. Adjust durations to fit 15–60s range
 * 3. Sort by score (descending)
 * 4. Remove overlaps (keep higher-scored)
 * 5. Select top 3–4
 *
 * @param {object} analysis - Gemini analysis result { segments[] }
 * @param {number} videoDuration - Total video duration in seconds
 * @returns {object[]} - Selected clips with adjusted timestamps
 */
export function selectClips(analysis, videoDuration = Infinity) {
  if (!analysis || !analysis.segments || analysis.segments.length === 0) {
    console.log('   ⚠️ No engagement segments to select from');
    return [];
  }

  let segments = [...analysis.segments];
  console.log(`   ✂️ Starting clip selection from ${segments.length} segments`);

  // Step 1: Merge close segments
  segments = mergeCloseSegments(segments);
  console.log(`   ✂️ After merging close segments: ${segments.length}`);

  // Step 2: Adjust durations
  segments = segments.map((seg) => adjustDuration(seg, videoDuration));

  // Step 3: Sort by score (highest first)
  segments.sort((a, b) => b.score - a.score);

  // Step 4: Remove overlaps (keep higher-scored segments)
  segments = removeOverlaps(segments);
  console.log(`   ✂️ After removing overlaps: ${segments.length}`);

  // Step 5: Take top MAX_CLIPS
  const selected = segments.slice(0, MAX_CLIPS);

  // Sort final clips by start time for logical ordering
  selected.sort((a, b) => a.start - b.start);

  // Add clip index
  selected.forEach((clip, i) => {
    clip.clipIndex = i + 1;
    clip.clipName = `clip_${i + 1}`;
  });

  console.log(`   ✅ Selected ${selected.length} clips:`);
  for (const clip of selected) {
    console.log(`      • Clip ${clip.clipIndex}: [${clip.start}s – ${clip.end}s] (${clip.duration}s) score=${clip.score} type=${clip.type}`);
  }

  return selected;
}
