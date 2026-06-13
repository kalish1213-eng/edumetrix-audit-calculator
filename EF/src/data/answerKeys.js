export const ANSWER_STATUSES = {
  unchecked: "unchecked",
  correct: "correct",
  incorrect: "incorrect"
};

export function createAnswerRecord({
  page,
  lessonId,
  exerciseId = "",
  fieldId,
  type,
  value,
  correctValue = null,
  status = ANSWER_STATUSES.unchecked,
  attempts = 0,
  updatedAt = new Date().toISOString()
}) {
  return {
    page,
    lessonId,
    exerciseId,
    fieldId,
    type,
    value,
    correctValue,
    status,
    attempts,
    updatedAt
  };
}
