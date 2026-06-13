export function normalizeAnswer(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[’`´]/g, "'")
    .replace(/\bi'm\b/g, "i am")
    .replace(/\byou're\b/g, "you are")
    .replace(/\bhe's\b/g, "he is")
    .replace(/\bshe's\b/g, "she is")
    .replace(/\bit's\b/g, "it is")
    .replace(/\bwe're\b/g, "we are")
    .replace(/\bthey're\b/g, "they are")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

export function acceptedAnswers(answer) {
  return String(answer)
    .split("|")
    .map((item) => normalizeAnswer(item))
    .filter(Boolean);
}

export function matchesAnswer(value, answer) {
  return acceptedAnswers(answer).includes(normalizeAnswer(value));
}

export function answerForReveal(answer) {
  return String(answer).split("|")[0] || "";
}
