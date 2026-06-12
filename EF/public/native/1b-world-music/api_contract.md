# API contract for ULC LMS interactive workbook page

This page uses native HTML inputs rather than absolute overlay inputs. The typed answers are stored against stable `field_id` values, not screen coordinates.

## Load attempt

`GET /api/lms/attempts/{lesson_id}?student_id={student_id}`

Response example:

```json
{
  "lesson_id": "english-file-beginner-workbook-unit-1b-world-music-page-6-native-inline",
  "student_id": "123",
  "status": "draft",
  "answers": {
    "b2_france": {"answer": "France", "exercise_id": "countries_sentences_1b", "updated_at": "2026-06-12T10:00:00Z"}
  }
}
```

## Save one answer

`POST /api/lms/attempts/answers`

```json
{
  "lesson_id": "english-file-beginner-workbook-unit-1b-world-music-page-6-native-inline",
  "student_id": "123",
  "field_id": "b2_france",
  "exercise_id": "countries_sentences_1b",
  "answer": "France",
  "timestamp": "2026-06-12T10:00:00Z"
}
```

## Submit attempt

`POST /api/lms/attempts/submit`

```json
{
  "lesson_id": "english-file-beginner-workbook-unit-1b-world-music-page-6-native-inline",
  "student_id": "123",
  "answers": {
    "b2_france": "France",
    "g4_hes": "He's"
  },
  "timestamp": "2026-06-12T10:00:00Z"
}
```

Expected response:

```json
{
  "lesson_id": "english-file-beginner-workbook-unit-1b-world-music-page-6-native-inline",
  "student_id": "123",
  "correct": 42,
  "total": 47,
  "filled": 47,
  "percent": 89,
  "by_exercise": {
    "countries_sentences_1b": {"correct": 10, "total": 10, "filled": 10}
  }
}
```

## Reset attempt

`POST /api/lms/attempts/reset`

```json
{
  "lesson_id": "english-file-beginner-workbook-unit-1b-world-music-page-6-native-inline",
  "student_id": "123"
}
```
