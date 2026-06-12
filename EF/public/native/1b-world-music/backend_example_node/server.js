const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const attempts = new Map();
function key(lesson_id, student_id){ return `${lesson_id}:${student_id}`; }
app.get('/api/lms/attempts/:lesson_id', (req,res)=>{
  const k = key(req.params.lesson_id, req.query.student_id || 'demo-student');
  res.json(attempts.get(k) || {lesson_id:req.params.lesson_id, student_id:req.query.student_id || 'demo-student', status:'draft', answers:{}, submissions:[]});
});
app.post('/api/lms/attempts/answers', (req,res)=>{
  const {lesson_id, student_id, field_id, exercise_id, answer, timestamp} = req.body;
  const k = key(lesson_id, student_id || 'demo-student');
  const attempt = attempts.get(k) || {lesson_id, student_id, status:'draft', answers:{}, submissions:[]};
  attempt.answers[field_id] = {answer, exercise_id, updated_at:timestamp || new Date().toISOString()};
  attempt.updated_at = new Date().toISOString();
  attempts.set(k, attempt);
  res.json({ok:true, attempt});
});
app.post('/api/lms/attempts/submit', (req,res)=>{
  const {lesson_id, student_id, answers} = req.body;
  // In production, grade on backend using the lesson JSON.
  const k = key(lesson_id, student_id || 'demo-student');
  const attempt = attempts.get(k) || {lesson_id, student_id, status:'draft', answers:{}, submissions:[]};
  attempt.status = 'submitted';
  attempt.last_payload = {answers, submitted_at:new Date().toISOString()};
  attempts.set(k, attempt);
  res.json({lesson_id, student_id, correct:0, total:0, filled:Object.keys(answers || {}).length, percent:0, by_exercise:{}, note:'Demo backend received submission. Add backend grading here.'});
});
app.post('/api/lms/attempts/reset', (req,res)=>{ attempts.delete(key(req.body.lesson_id, req.body.student_id || 'demo-student')); res.json({ok:true}); });
app.listen(3000, ()=>console.log('Demo LMS API on http://localhost:3000'));
