(function () {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  const lesson = JSON.parse(document.getElementById("lesson-json").textContent);
  const storagePrefix = "ef-native-attempt:";
  const fields = lesson.fields || [];
  const fieldById = Object.fromEntries(fields.map((field) => [field.id, field]));
  const scorable = () => fields.filter((field) => !field.readonly && !field.free);
  const fillable = () => fields.filter((field) => !field.readonly);

  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const filledStat = document.getElementById("filledStat");
  const totalStat = document.getElementById("totalStat");
  const scoreStat = document.getElementById("scoreStat");
  const percentStat = document.getElementById("percentStat");
  const resultBox = document.getElementById("resultBox");
  const toast = document.getElementById("toast");
  let toastTimer;
  let resetScrollTimer;

  function storageKey() {
    return `${storagePrefix}${lesson.lesson_id}`;
  }

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[’`´]/g, "'")
      .replace(/\s+/g, " ")
      .replace(/[^a-z0-9']/g, "")
      .replace(/'/g, "");
  }

  function expected(field) {
    return (field.answers || []).map(normalize).filter(Boolean);
  }

  function isCorrect(field, value) {
    const normalized = normalize(value);
    return !!normalized && expected(field).includes(normalized);
  }

  function valueFor(field) {
    const control = document.querySelector(`[data-field-id="${CSS.escape(field.id)}"]`);
    if (!control) return "";
    if (control.type === "checkbox" || control.type === "radio") return control.checked ? control.value : "";
    return control.value || "";
  }

  function setValue(field, value) {
    const control = document.querySelector(`[data-field-id="${CSS.escape(field.id)}"]`);
    if (!control) return;
    if (control.type === "checkbox" || control.type === "radio") {
      control.checked = normalize(control.value) === normalize(value);
      return;
    }
    control.value = value || "";
  }

  function readValues() {
    return Object.fromEntries(fields.map((field) => [field.id, valueFor(field)]));
  }

  function writeValues(values) {
    fields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(values, field.id)) setValue(field, values[field.id]);
    });
  }

  function saveValues() {
    localStorage.setItem(storageKey(), JSON.stringify({ values: readValues(), updated_at: new Date().toISOString() }));
  }

  function loadValues() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey()) || "{}");
      if (saved.values) writeValues(saved.values);
    } catch (error) {
      localStorage.removeItem(storageKey());
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function installInlineAnswerStyles() {
    if (document.getElementById("nativeInlineAnswerStyles")) return;
    const style = document.createElement("style");
    style.id = "nativeInlineAnswerStyles";
    style.textContent = `
      .native-answer-hint {
        display: inline-flex;
        align-items: center;
        min-height: 22px;
        max-width: min(260px, 70vw);
        margin-left: 6px;
        padding: 2px 7px;
        border: 1px solid #f4a8a1;
        border-radius: 7px;
        background: #fff7f5;
        color: #982f23;
        font: 800 12px/1.25 Arial, Helvetica, sans-serif;
        box-shadow: 0 6px 14px rgba(120, 40, 30, .12);
        vertical-align: middle;
        white-space: normal;
        overflow-wrap: anywhere;
      }
      .native-answer-hint::before {
        content: "Answer:";
        margin-right: 4px;
        color: #7a231a;
        font-weight: 900;
      }
      .native-answer-hint.overlay {
        position: absolute;
        z-index: 12;
        margin: 0;
        transform: translate(4px, -1px);
        pointer-events: none;
      }
      .native-answer-reveal {
        width: 24px;
        height: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 4px;
        border: 1px solid #b7c7df;
        border-radius: 50%;
        background: #fff;
        color: #26588f;
        font: 900 13px/1 Arial, Helvetica, sans-serif;
        box-shadow: 0 5px 12px rgba(35, 70, 110, .14);
        cursor: pointer;
        opacity: .42;
        vertical-align: middle;
      }
      .native-answer-reveal:hover,
      .native-answer-reveal:focus {
        border-color: #26588f;
        background: #eef6ff;
        outline: none;
        opacity: 1;
      }
      .native-answer-reveal.overlay {
        position: absolute;
        z-index: 13;
        margin: 0;
        transform: translate(4px, -2px);
      }
      .native-zoomable-image {
        cursor: zoom-in;
      }
      .native-image-zoom {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: 18px;
        border: 0;
        background: rgba(12, 17, 28, .86);
        cursor: zoom-out;
      }
      .native-image-zoom img {
        display: block;
        max-width: 96vw;
        max-height: 92vh;
        width: auto;
        height: auto;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 28px 80px rgba(0, 0, 0, .42);
      }
      .native-image-zoom button {
        position: fixed;
        top: 14px;
        right: 14px;
        width: 38px;
        height: 38px;
        border: 1px solid rgba(255, 255, 255, .42);
        border-radius: 50%;
        background: rgba(255, 255, 255, .94);
        color: #172033;
        font: 900 22px/1 Arial, Helvetica, sans-serif;
        cursor: pointer;
      }
      .answer.state-ok + .native-answer-hint,
      .answer:focus + .native-answer-hint {
        display: none;
      }
      @media (max-width: 760px) {
        .native-answer-hint {
          font-size: 11px;
          padding: 2px 5px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function answerText(field) {
    return String((field.answers || []).find((answer) => String(answer || "").trim()) || "");
  }

  function removeAnswerHint(field) {
    document.querySelector(`[data-answer-hint-for="${CSS.escape(field.id)}"]`)?.remove();
  }

  function positionOverlayHint(hint, control) {
    const x = Number.parseFloat(control.style.getPropertyValue("--x"));
    const y = Number.parseFloat(control.style.getPropertyValue("--y"));
    const w = Number.parseFloat(control.style.getPropertyValue("--w"));
    if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
    hint.classList.add("overlay");
    hint.style.left = `${Math.min(95, x + (Number.isFinite(w) ? w : 0))}%`;
    hint.style.top = `${y}%`;
    control.parentElement?.appendChild(hint);
    return true;
  }

  function showAnswerHint(field) {
    const control = document.querySelector(`[data-field-id="${CSS.escape(field.id)}"]`);
    const answer = answerText(field);
    if (!control || !answer) return;
    removeAnswerHint(field);
    const hint = document.createElement("span");
    hint.className = "native-answer-hint";
    hint.dataset.answerHintFor = field.id;
    hint.textContent = answer;
    const isOverlay = control.classList.contains("overlay-field") || getComputedStyle(control).position === "absolute";
    if (isOverlay && positionOverlayHint(hint, control)) return;
    control.insertAdjacentElement("afterend", hint);
  }

  function clearAnswerHints() {
    document.querySelectorAll(".native-answer-hint").forEach((hint) => hint.remove());
  }

  function removeRevealButtons() {
    document.querySelectorAll(".native-answer-reveal").forEach((button) => button.remove());
  }

  function positionOverlayReveal(button, control) {
    const x = Number.parseFloat(control.style.getPropertyValue("--x"));
    const y = Number.parseFloat(control.style.getPropertyValue("--y"));
    const w = Number.parseFloat(control.style.getPropertyValue("--w"));
    if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
    button.classList.add("overlay");
    button.style.left = `${Math.min(96, x + (Number.isFinite(w) ? w : 0))}%`;
    button.style.top = `${y}%`;
    control.parentElement?.appendChild(button);
    return true;
  }

  function revealSingleAnswer(field) {
    const answer = answerText(field);
    const control = document.querySelector(`[data-field-id="${CSS.escape(field.id)}"]`);
    if (!answer || !control) return;
    setValue(field, answer);
    clearState(control);
    control.classList.add("state-ok");
    removeAnswerHint(field);
    document.querySelector(`[data-answer-reveal-for="${CSS.escape(field.id)}"]`)?.remove();
    updateProgress();
    saveValues();
    resultBox.textContent = "Answer inserted for this field.";
    showToast("Answer inserted.");
  }

  function showAnswerReveal(field) {
    const control = document.querySelector(`[data-field-id="${CSS.escape(field.id)}"]`);
    if (!control || field.readonly || field.free || !answerText(field)) return;
    if (document.querySelector(`[data-answer-reveal-for="${CSS.escape(field.id)}"]`)) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "native-answer-reveal";
    button.dataset.answerRevealFor = field.id;
    button.setAttribute("aria-label", "Show answer for this field");
    button.title = "Show answer for this field";
    button.textContent = "?";
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("click", () => revealSingleAnswer(field));
    const isOverlay = control.classList.contains("overlay-field") || getComputedStyle(control).position === "absolute";
    if (isOverlay && positionOverlayReveal(button, control)) return;
    control.insertAdjacentElement("afterend", button);
  }

  function initAnswerReveals() {
    scorable().forEach(showAnswerReveal);
  }

  function closeImageZoom() {
    document.querySelector(".native-image-zoom")?.remove();
  }

  function openImageZoom(image) {
    closeImageZoom();
    const overlay = document.createElement("div");
    overlay.className = "native-image-zoom";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Enlarged exercise image");

    const zoomed = document.createElement("img");
    zoomed.src = image.currentSrc || image.src;
    zoomed.alt = image.alt || "";

    const close = document.createElement("button");
    close.type = "button";
    close.setAttribute("aria-label", "Close image");
    close.textContent = "x";

    overlay.append(zoomed, close);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay || event.target === close) closeImageZoom();
    });
    document.body.appendChild(overlay);
    close.focus();
  }

  function initImageZoom() {
    document.querySelectorAll(".dialogue-card img, .grammar-photo img, .photo-option img, .goodbye-card img").forEach((image) => {
      if (image.dataset.nativeZoomReady === "true") return;
      image.dataset.nativeZoomReady = "true";
      image.classList.add("native-zoomable-image");
      image.setAttribute("title", "Click to enlarge");
      image.addEventListener("click", () => openImageZoom(image));
    });
  }

  function clearState(control) {
    control.classList.remove("state-ok", "state-bad", "state-empty");
  }

  function updateProgress() {
    const activeFields = fillable();
    const values = readValues();
    const filled = activeFields.filter((field) => String(values[field.id] || "").trim()).length;
    const pct = activeFields.length ? Math.round((filled / activeFields.length) * 100) : 0;
    progressBar.style.width = `${pct}%`;
    progressText.textContent = `${pct}%`;
    filledStat.textContent = String(filled);
    totalStat.textContent = String(activeFields.length);
  }

  function grade() {
    const values = readValues();
    let correct = 0;
    scorable().forEach((field) => {
      if (isCorrect(field, values[field.id])) correct += 1;
    });
    const total = scorable().length;
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0, values };
  }

  function check() {
    const result = grade();
    clearAnswerHints();
    scorable().forEach((field) => {
      const control = document.querySelector(`[data-field-id="${CSS.escape(field.id)}"]`);
      if (!control) return;
      clearState(control);
      const value = valueFor(field);
      if (!String(value).trim()) control.classList.add("state-empty");
      else if (isCorrect(field, value)) control.classList.add("state-ok");
      else control.classList.add("state-bad");
      if (!String(value).trim() || !isCorrect(field, value)) showAnswerHint(field);
    });
    scoreStat.textContent = String(result.correct);
    percentStat.textContent = `${result.percent}%`;
    resultBox.textContent = `Checked: ${result.correct}/${result.total} correct (${result.percent}%). Corrections are shown next to the fields.`;
    saveValues();
    showToast(`Checked: ${result.correct}/${result.total}`);
  }

  function showAnswers() {
    removeRevealButtons();
    clearAnswerHints();
    scorable().forEach((field) => {
      setValue(field, field.answers?.[0] || "");
      const control = document.querySelector(`[data-field-id="${CSS.escape(field.id)}"]`);
      if (control) {
        clearState(control);
        control.classList.add("state-ok");
      }
    });
    updateProgress();
    saveValues();
    scoreStat.textContent = String(scorable().length);
    percentStat.textContent = "100%";
    resultBox.textContent = "Answers inserted. In a production LMS this should be a teacher-only action.";
    showToast("Answers inserted.");
  }

  function reset() {
    removeRevealButtons();
    clearAnswerHints();
    fillable().forEach((field) => {
      setValue(field, "");
      const control = document.querySelector(`[data-field-id="${CSS.escape(field.id)}"]`);
      if (control) clearState(control);
    });
    localStorage.removeItem(storageKey());
    updateProgress();
    initAnswerReveals();
    scoreStat.textContent = "-";
    percentStat.textContent = "-";
    resultBox.textContent = "Answers reset.";
    showToast("Reset.");
  }

  function exportAttempt() {
    const payload = {
      lesson_id: lesson.lesson_id,
      exported_at: new Date().toISOString(),
      values: readValues(),
      score: grade()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "1A_A_cappuccino_please_attempt.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function init() {
    resetLessonScroll();

    document.querySelectorAll("[data-field-id]").forEach((control) => {
      const field = fieldById[control.dataset.fieldId];
      if (!field) return;
      if (field.readonly) {
        control.value = field.initial_value || field.answers?.[0] || "";
        control.setAttribute("readonly", "readonly");
      }
      control.addEventListener("input", () => {
        clearState(control);
        removeAnswerHint(field);
        if (!field.free && answerText(field)) showAnswerReveal(field);
        updateProgress();
        saveValues();
      });
      control.addEventListener("change", () => {
        clearState(control);
        removeAnswerHint(field);
        if (!field.free && answerText(field)) showAnswerReveal(field);
        updateProgress();
        saveValues();
      });
      control.addEventListener("focus", () => showAnswerReveal(field));
    });

    installInlineAnswerStyles();
    initAnswerReveals();
    initImageZoom();
    loadValues();
    updateProgress();
    document.getElementById("checkBtn").addEventListener("click", check);
    document.getElementById("answersBtn").addEventListener("click", showAnswers);
    document.getElementById("resetBtn").addEventListener("click", reset);
    document.getElementById("exportBtn").addEventListener("click", exportAttempt);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeImageZoom();
    });
  }

  function resetLessonScroll() {
    const reset = () => window.scrollTo(0, 0);

    clearTimeout(resetScrollTimer);
    reset();
    resetScrollTimer = setTimeout(() => {
      reset();
      resetScrollTimer = null;
    }, 0);
  }

  window.addEventListener("pageshow", () => {
    resetLessonScroll();
  });

  init();
})();
