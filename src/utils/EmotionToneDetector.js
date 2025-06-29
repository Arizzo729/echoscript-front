export default function detectTone(text) {
  const lower = text.toLowerCase();

  const positiveRegex = /\b(amazing|awesome|great|excited|cool|yay|yes|love|fantastic|wonderful|incredible|happy|satisfied|blessed|joyful|thrilled|grateful)\b/;
  const negativeRegex = /\b(sad|tired|bad|confused|lost|sorry|angry|upset|hate|frustrated|annoyed|depressed|stressed|miserable|lonely|terrible|ugh|nope)\b/;

  if (positiveRegex.test(lower)) return "positive";
  if (negativeRegex.test(lower)) return "negative";
  return "neutral";
}
