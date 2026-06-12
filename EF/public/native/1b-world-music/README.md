# 1B World music — native LMS version, no answer overlap

This version rebuilds the workbook page as native HTML instead of placing inputs on top of a background image.

Main difference from the earlier clickable prototype:

- inputs are inline inside the sentences;
- crossword answers are real cells;
- grammar answers sit in their own answer slots below images;
- typed text never covers printed text;
- field IDs are stable and backend-friendly;
- local demo saving works through browser localStorage;
- backend can be connected through the API contract.

Open `index.html` for the modular version or `lms_1b_world_music_no_overlap.html` for a single-file demo.
