const STORAGE_KEY = "echoscript_usage";
const MONTHLY_LIMIT_MINUTES = 60;

export function getTranscriptionUsage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { minutesUsed: 0, month: currentMonth() };

  try {
    const data = JSON.parse(raw);
    // Reset usage if the month changed
    if (data.month !== currentMonth()) {
      return { minutesUsed: 0, month: currentMonth() };
    }
    return data;
  } catch {
    return { minutesUsed: 0, month: currentMonth() };
  }
}

export function updateTranscriptionUsage(minutesToAdd) {
  const usage = getTranscriptionUsage();
  const newUsage = {
    minutesUsed: usage.minutesUsed + minutesToAdd,
    month: currentMonth(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
}

export function hasRemainingMinutes(minutesNeeded) {
  const usage = getTranscriptionUsage();
  return usage.minutesUsed + minutesNeeded <= MONTHLY_LIMIT_MINUTES;
}

export function getRemainingMinutes() {
  const usage = getTranscriptionUsage();
  return Math.max(0, MONTHLY_LIMIT_MINUTES - usage.minutesUsed);
}

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
}
