export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getStartPageFromHash(hash, fallback = 1) {
  const match = String(hash || "").match(/page=(\d+)/);
  return match ? Number(match[1]) : fallback;
}

export function clampPageNumber(pageNumber, pageCount) {
  return clamp(Number(pageNumber) || 1, 1, pageCount);
}
