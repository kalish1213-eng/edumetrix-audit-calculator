# EF Interactive Student Book

Static browser version of the English File Beginner Student's Book.

## Coverage

- 137 book pages are included.
- Native interactive coverage spans pages 1-137 through 66 modules.
- Page images are exported at 4608 x 5805 pixels; page 3 is a redrawn SVG.
- Interactive fields: 2829 total.
- Checked answer fields: 2289.
- Free writing / speaking practice fields: 532.
- Checked fields without answer keys: 0.

## How To Open

Use a static web server and open:

```text
index.html
```

GitHub Pages target:

```text
https://kalish1213-eng.github.io/edumetrix-audit-calculator/EF/index.html?v=20260612-fieldreveal2#page=1
```

## Source Structure

The LMS shell is vanilla JavaScript, organized as ES modules:

```text
src/
  components/   LMS shell component contracts and DOM selectors
  data/         page metadata, answer record shape, lesson ranges
  state/        workbook, answer, and autosave state adapters
  utils/        answer checking, page navigation, storage helpers
  styles/       design tokens and future CSS split points
```

`app.js` remains the runtime entry point for the interactive workbook, while stable data and pure logic now live under `src/`. The old localStorage answer layer is wrapped through `state/useAnswersState.js` so it can later be replaced by an API without changing the workbook UI calls.

## Interaction

- Type or select answers directly inside the exercises.
- Use `Check` to mark answers and show corrections next to incorrect or empty fields.
- Use `?` next to a field to reveal only that one answer.
- Use `Show answers` to insert all fixed answers in the current module.
- Free writing and speaking fields are saved locally but are not auto-graded.
- `Export` downloads the current attempt as JSON.

Answers are stored in each native lesson's `lesson-json` block and are applied by the shared runtime in `app.js`.

## Verification

Run the local audit script from the project root:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\verify-ef-project.ps1
```

Expected summary: `Status: ok`, 137 pages, 66 native modules, 2829 interactive fields, 2289 checked fields, and 0 checked fields without answer keys.

For browser acceptance checks, open:

```text
acceptance.html?v=20260614-overlapaudit2
```

The runner covers opening, student mode, answer saving, navigation, checking, reset confirmation, responsive widths, and contextual AI hints. It snapshots EF localStorage before running and restores it when the run finishes.
