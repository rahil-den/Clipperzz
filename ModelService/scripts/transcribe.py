"""
Clipperz — Whisper Transcription Script
Transcribes an audio file and outputs word-level timestamped JSON.

Usage:
  python scripts/transcribe.py <audio_path> <output_path> [--model base]

Output JSON format:
{
  "text": "full transcript...",
  "language": "en",
  "segments": [
    {
      "id": 0,
      "start": 0.0,
      "end": 3.5,
      "text": "segment text",
      "words": [
        { "word": "hello", "start": 0.0, "end": 0.5 }
      ]
    }
  ]
}
"""

import sys
import os
import json
import whisper
import argparse

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    os.environ['PYTHONIOENCODING'] = 'utf-8'


def transcribe(audio_path, output_path, model_name="base"):
    print(f"   [Whisper] Loading model: {model_name}")
    model = whisper.load_model(model_name)

    print(f"   [Whisper] Transcribing: {audio_path}")

    result = model.transcribe(
        audio_path,
        word_timestamps=True,
        verbose=False,
    )

    # Build clean output
    segments = []
    for seg in result.get("segments", []):
        segment = {
            "id": seg["id"],
            "start": round(seg["start"], 2),
            "end": round(seg["end"], 2),
            "text": seg["text"].strip(),
        }

        # Include word-level timestamps if available
        words = []
        for w in seg.get("words", []):
            words.append({
                "word": w["word"].strip(),
                "start": round(w["start"], 2),
                "end": round(w["end"], 2),
            })
        segment["words"] = words
        segments.append(segment)

    output = {
        "text": result.get("text", "").strip(),
        "language": result.get("language", "unknown"),
        "segments": segments,
    }

    # Write JSON output
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"   [OK] Transcript saved to: {output_path}")
    print(f"   [INFO] Segments: {len(segments)} | Language: {output['language']}")

    return output


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Transcribe audio using Whisper")
    parser.add_argument("audio_path", help="Path to the audio file")
    parser.add_argument("output_path", help="Path to save the transcript JSON")
    parser.add_argument("--model", default="base", help="Whisper model size (tiny/base/small/medium/large)")

    args = parser.parse_args()
    transcribe(args.audio_path, args.output_path, args.model)
