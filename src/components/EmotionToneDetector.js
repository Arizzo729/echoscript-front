// 5. EmotionToneDetector.js (Enhanced tone categories)
export default function detectTone(text) {
  const lower = text.toLowerCase();
  if (/awesome|great|excited|cool|yay|yes|love/.test(lower)) return "positive";
  if (/sad|tired|bad|confused|lost|sorry/.test(lower)) return "negative";
  return "neutral";
}