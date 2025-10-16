// src/utils/EmotionToneDetector.js

/**
 * Build-safe placeholder. No JSX here.
 * Replace with your real model/heuristics later.
 */

export function analyzeTone(text = "") {
  // TODO: implement real tone detection
  if (!text || typeof text !== "string") {
    return { emotion: "neutral", score: 0 };
  }

  const lower = text.toLowerCase();
  if (/\b(angry|furious|mad|rage)\b/.test(lower)) return { emotion: "anger", score: 0.9 };
  if (/\b(happy|glad|joy|excited)\b/.test(lower)) return { emotion: "joy", score: 0.8 };
  if (/\b(sad|down|unhappy|depress)\b/.test(lower)) return { emotion: "sadness", score: 0.8 };
  if (/\b(fear|afraid|scared|anxious)\b/.test(lower)) return { emotion: "fear", score: 0.8 };
  if (/\b(surpris|wow|shocked)\b/.test(lower)) return { emotion: "surprise", score: 0.7 };

  return { emotion: "neutral", score: 0.2 };
}

export default analyzeTone;
