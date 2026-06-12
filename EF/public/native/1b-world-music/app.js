
(function(){
  const lesson = JSON.parse(document.getElementById('lesson-json').textContent);
  const storagePrefix = 'ulc-lms-inline-attempt:';
  const progressText = document.getElementById('progressText');
  const progressBar = document.getElementById('progressBar');
  const resultBox = document.getElementById('resultBox');
  const toast = document.getElementById('toast');
  const apiMode = document.getElementById('apiMode');
  const studentIdInput = document.getElementById('studentId');
  const backendUrlInput = document.getElementById('backendUrl');
  let toastTimer;

  const normalize = (value) => (value || '').toString().trim().toLowerCase()
    .replace(/[’`´]/g,"'")
    .replace(/\s+/g,' ')
    .replace(/[^a-z']/g,'')
    .replace(/'/g,'');
  const nowIso = () => new Date().toISOString();
  const studentId = () => (studentIdInput.value || 'demo-student').trim();
  const storageKey = () => storagePrefix + lesson.lesson_id + ':' + studentId();
  const fieldById = Object.fromEntries(lesson.fields.map(f => [f.id, f]));
  const scorable = () => lesson.fields.filter(f => !f.readonly);

  function showToast(msg){ toast.textContent = msg; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(()=>toast.classList.remove('show'), 2600); }
  function expected(field){ return (field.answers || []).map(normalize).filter(Boolean); }
  function isCorrect(field, value){ const v = normalize(value); return !!v && expected(field).includes(v); }
  function readValues(){
    const data = {};
    scorable().forEach(f => { const el = document.querySelector(`[data-field-id="${CSS.escape(f.id)}"]`); data[f.id] = el ? el.value : ''; });
    return data;
  }
  function grade(values){
    const byExercise = {};
    scorable().forEach(f => {
      byExercise[f.exercise_id] ||= {correct:0,total:0,filled:0};
      byExercise[f.exercise_id].total++;
      const val = values[f.id] || '';
      if(String(val).trim()) byExercise[f.exercise_id].filled++;
      if(isCorrect(f, val)) byExercise[f.exercise_id].correct++;
    });
    const total = Object.values(byExercise).reduce((s,x)=>s+x.total,0);
    const correct = Object.values(byExercise).reduce((s,x)=>s+x.correct,0);
    const filled = Object.values(byExercise).reduce((s,x)=>s+x.filled,0);
    return {lesson_id:lesson.lesson_id, student_id:studentId(), correct,total,filled,percent: total ? Math.round(correct/total*100) : 0, by_exercise:byExercise, checked_at:nowIso()};
  }

  class DemoApi {
    async loadAttempt(){
      const raw = localStorage.getItem(storageKey());
      if(!raw) return {lesson_id:lesson.lesson_id, student_id:studentId(), status:'draft', answers:{}, submissions:[]};
      try{return JSON.parse(raw)}catch(e){return {lesson_id:lesson.lesson_id, student_id:studentId(), status:'draft', answers:{}, submissions:[]};}
    }
    async saveAttempt(attempt){ attempt.updated_at = nowIso(); localStorage.setItem(storageKey(), JSON.stringify(attempt)); return attempt; }
    async saveAnswer(payload){ const attempt = await this.loadAttempt(); attempt.answers[payload.field_id] = {answer:payload.answer, exercise_id:payload.exercise_id, updated_at:payload.timestamp || nowIso()}; return this.saveAttempt(attempt); }
    async resetAttempt(){ localStorage.removeItem(storageKey()); return {ok:true}; }
    async submitAttempt(payload){ const attempt = await this.loadAttempt(); const result = grade(payload.answers || readValues()); attempt.status='submitted'; attempt.last_score=result; attempt.submissions ||= []; attempt.submissions.push({submitted_at:nowIso(), result}); await this.saveAttempt(attempt); return result; }
  }
  class HttpApi extends DemoApi{
    constructor(baseUrl){ super(); this.baseUrl = baseUrl.replace(/\/$/,''); }
    async req(path, options={}){ const res = await fetch(this.baseUrl+path,{headers:{'Content-Type':'application/json'}, ...options}); if(!res.ok) throw new Error('HTTP '+res.status); return res.json(); }
    async loadAttempt(){ return this.req(`/api/lms/attempts/${encodeURIComponent(lesson.lesson_id)}?student_id=${encodeURIComponent(studentId())}`); }
    async saveAnswer(payload){ return this.req('/api/lms/attempts/answers',{method:'POST',body:JSON.stringify(payload)}); }
    async resetAttempt(){ return this.req('/api/lms/attempts/reset',{method:'POST',body:JSON.stringify({lesson_id:lesson.lesson_id, student_id:studentId()})}); }
    async submitAttempt(payload){ return this.req('/api/lms/attempts/submit',{method:'POST',body:JSON.stringify(payload)}); }
  }
  let api = new DemoApi();
  function setApi(){ const url=(backendUrlInput.value||'').trim(); api = url ? new HttpApi(url) : new DemoApi(); apiMode.textContent = url ? 'API: backend' : 'API: demo browser'; }

  function updateProgress(){
    const values = readValues(); const fields = scorable();
    const filled = fields.filter(f => String(values[f.id] || '').trim()).length;
    const pct = fields.length ? Math.round(filled / fields.length * 100) : 0;
    progressText.textContent = pct+'%'; progressBar.style.width = pct+'%';
    document.getElementById('filledStat').textContent = filled;
    document.getElementById('totalStat').textContent = fields.length;
  }
  function clearState(el){ el.classList.remove('state-ok','state-bad','state-empty'); }
  async function onInput(el){
    const f = fieldById[el.dataset.fieldId]; if(!f || f.readonly) return;
    if(f.kind === 'crossword_cell'){
      el.value = (el.value || '').slice(0,1).toUpperCase();
      if(el.value){
        const cells = [...document.querySelectorAll('.cw-input:not(.readonly)')];
        const i = cells.indexOf(el); if(i >= 0 && cells[i+1]) cells[i+1].focus();
      }
    }
    clearState(el); updateProgress();
    try{ await api.saveAnswer({lesson_id:lesson.lesson_id, student_id:studentId(), field_id:f.id, exercise_id:f.exercise_id, answer:el.value, timestamp:nowIso()}); }
    catch(e){ showToast('Backend не ответил. Ответ сохранён только локально.'); }
  }
  function applyResult(result){
    const values = readValues();
    scorable().forEach(f => {
      const el = document.querySelector(`[data-field-id="${CSS.escape(f.id)}"]`); if(!el) return;
      clearState(el); const val = values[f.id] || '';
      if(!String(val).trim()) el.classList.add('state-empty');
      else if(isCorrect(f,val)) el.classList.add('state-ok');
      else el.classList.add('state-bad');
    });
    document.getElementById('scoreStat').textContent = result.correct;
    document.getElementById('percentStat').textContent = result.percent+'%';
    const lines = [`Результат: ${result.correct}/${result.total} (${result.percent}%).`, `Заполнено: ${result.filled}/${result.total}.`];
    lesson.exercises.forEach(ex => { const r = result.by_exercise[ex.id]; if(r) lines.push(`${ex.section}: ${r.correct}/${r.total}`); });
    resultBox.textContent = lines.join('\n');
  }
  async function load(){
    setApi();
    try{
      const attempt = await api.loadAttempt(); const answers = attempt.answers || {};
      scorable().forEach(f => {
        const el = document.querySelector(`[data-field-id="${CSS.escape(f.id)}"]`); if(!el) return;
        const a = answers[f.id];
        el.value = a && typeof a === 'object' ? (a.answer || '') : (typeof a === 'string' ? a : '');
        clearState(el);
      });
      updateProgress();
    }catch(e){ showToast('Backend не ответил. Перехожу в demo-режим.'); backendUrlInput.value=''; setApi(); updateProgress(); }
  }
  async function check(){
    setApi(); const values = readValues(); let result;
    try{ result = await api.submitAttempt({lesson_id:lesson.lesson_id, student_id:studentId(), answers:values, timestamp:nowIso()}); }
    catch(e){ result = grade(values); showToast('Backend не ответил, проверка выполнена локально.'); }
    applyResult(result); showToast(`Проверено: ${result.correct}/${result.total}`);
  }
  async function showAnswers(){
    scorable().forEach(f => { const el = document.querySelector(`[data-field-id="${CSS.escape(f.id)}"]`); if(el){ el.value = (f.answers && f.answers[0]) || ''; clearState(el); el.classList.add('state-ok'); }});
    updateProgress();
    const vals = readValues();
    for(const f of scorable()) await api.saveAnswer({lesson_id:lesson.lesson_id, student_id:studentId(), field_id:f.id, exercise_id:f.exercise_id, answer:vals[f.id], timestamp:nowIso()}).catch(()=>{});
    showToast('Ответы подставлены. В боевой LMS это режим преподавателя.');
  }
  async function reset(){
    if(!confirm('Сбросить все ответы на этой LMS-странице?')) return;
    scorable().forEach(f => { const el = document.querySelector(`[data-field-id="${CSS.escape(f.id)}"]`); if(el){ el.value=''; clearState(el); }});
    await api.resetAttempt().catch(()=>{}); updateProgress(); document.getElementById('scoreStat').textContent='—'; document.getElementById('percentStat').textContent='—'; resultBox.textContent='Ответы сброшены.'; showToast('Сброшено.');
  }
  function exportAttempt(){ const data = {lesson_id:lesson.lesson_id, student_id:studentId(), exported_at:nowIso(), answers:readValues(), result:grade(readValues())}; const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='1B_World_music_attempt.json'; a.click(); URL.revokeObjectURL(a.href); }
  function importAttempt(file){ const reader = new FileReader(); reader.onload=()=>{ try{ const data=JSON.parse(reader.result); const answers=data.answers||{}; scorable().forEach(f=>{ const el=document.querySelector(`[data-field-id="${CSS.escape(f.id)}"]`); if(el && answers[f.id]!==undefined){ el.value= typeof answers[f.id] === 'object' ? answers[f.id].answer || '' : answers[f.id]; clearState(el); }}); updateProgress(); showToast('Ответы импортированы.'); }catch(e){ showToast('Не удалось прочитать JSON.'); } }; reader.readAsText(file); }

  function init(){
    lesson.exercises.forEach(ex => { const div=document.createElement('div'); div.className='exercise'; div.innerHTML=`<strong>${ex.section}</strong><small>${ex.instruction}</small>`; document.getElementById('exerciseList').appendChild(div); });
    lesson.fields.filter(f=>f.readonly).forEach(f => { const el=document.querySelector(`[data-field-id="${CSS.escape(f.id)}"]`); if(el && f.initial_value && !el.value) el.value=f.initial_value; });
    document.querySelectorAll('input[data-field-id]').forEach(el => { if(!el.readOnly) el.addEventListener('input', () => onInput(el)); });
    document.getElementById('checkBtn').addEventListener('click', check);
    document.getElementById('answersBtn').addEventListener('click', showAnswers);
    document.getElementById('resetBtn').addEventListener('click', reset);
    document.getElementById('exportBtn').addEventListener('click', exportAttempt);
    document.getElementById('importFile').addEventListener('change', e => e.target.files[0] && importAttempt(e.target.files[0]));
    backendUrlInput.addEventListener('change', load); studentIdInput.addEventListener('change', load);
    load();
  }
  init();
})();
