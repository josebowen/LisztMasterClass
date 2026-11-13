import { PHOTO, PEOPLE, WALL, TOPICS, DISCS, ABOUT, LINKS } from './content.js';
const $ = s => document.querySelector(s);
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const state = { topic: null, idx: 0, disc: null, list: [], clipOk: {} };
const LAB = { Beethoven: '#7d2a22', Liszt: '#1f4a3a', Chopin: '#27406b', Weber: '#6b4a1e' };

// ---------- build static parts
$('#group').src = PHOTO.src;
$('#topics').innerHTML = TOPICS.map(t => `<button type="button" data-topic="${t.id}" aria-pressed="false">${esc(t.label)}</button>`).join('');
$('#faces').innerHTML = Object.entries(PEOPLE).filter(([, p]) => p.at).map(([k, p]) => `<button type="button" class="face" data-p="${k}" style="left:${p.at[0]}%;top:${p.at[1]}%" aria-label="${esc(p.name)}"><b>${esc(p.short)}</b></button>`).join('');
const med = k => { const p = PEOPLE[k]; const ini = k === 'others' ? '\u2026' : p.name.split(' ').map(w => w[0]).join('').slice(0, 2); return `<button type="button" class="med" data-p="${k}"><div class="pic"${p.img ? ` style="background-image:url('${p.img.replace(/'/g, '%27')}')"` : ''}>${p.img ? '' : ini}</div><span>${esc(p.short)}</span></button>`; };
$('#wallL').innerHTML = WALL.left.map(med).join(''); $('#wallR').innerHTML = WALL.right.map(med).join('');
$('#discs').innerHTML = DISCS.map(d => `<button type="button" class="disc" data-disc="${d.id}" style="--lab:${LAB[d.composer]}"><i></i><div><b>${esc(d.composer)}</b><span>${esc(d.short || d.title)}</span><span>${esc(PEOPLE[d.player].short)}, ${esc(String(d.when || d.year))}</span></div></button>`).join('');
const el = k => document.querySelector(`[data-p="${k}"]`);

// ---------- audio
const audio = new Audio(); audio.preload = 'none'; let actx, analyser, buf;
function setupAudio() { if (actx) return; try { actx = new (window.AudioContext || window.webkitAudioContext)(); const s = actx.createMediaElementSource(audio); analyser = actx.createAnalyser(); analyser.fftSize = 128; buf = new Uint8Array(analyser.frequencyBinCount); s.connect(analyser); analyser.connect(actx.destination); } catch (e) { actx = null; } }
function playDisc(id) {
  const d = DISCS.find(x => x.id === id); setupAudio(); if (actx && actx.state === 'suspended') actx.resume();
  if (state.disc === id) { audio.paused ? audio.play() : audio.pause(); return; }
  state.disc = id; audio.src = d.clip; audio.play().then(() => { state.clipOk[id] = true; }).catch(() => { state.clipOk[id] = false; sync(); });
  state.list = d.quotes || TOPICS.find(t => t.id === d.topic).quotes.filter(q => q.disc === id); if (!state.list.length) state.list = TOPICS.find(t => t.id === d.topic).quotes;
  state.topic = d.quotes ? null : d.topic; state.idx = 0; render();
}
['play', 'pause', 'ended'].forEach(e => audio.addEventListener(e, sync));
audio.addEventListener('error', () => { if (state.disc) { state.clipOk[state.disc] = false; sync(); } });
function sync() {
  document.querySelectorAll('.disc').forEach(b => { b.classList.toggle('on', b.dataset.disc === state.disc); b.classList.toggle('paused', audio.paused); });
  document.querySelectorAll('.med').forEach(m => m.classList.remove('playing'));
  const d = DISCS.find(x => x.id === state.disc); if (!d) { $('#nowText').textContent = 'Choose a disc to hear a pupil play.'; return; }
  if (!audio.paused) el(d.player).classList.add('playing');
  $('#nowText').innerHTML = state.clipOk[d.id] === false ? 'This clip could not be loaded.' : `<b style="color:var(--gold)">${esc(PEOPLE[d.player].name)}</b> ${audio.paused ? 'played' : 'plays'} ${esc(d.title)}. ${esc(d.part)}. ${esc(d.info || (d.label + ', ' + d.year + ', about ' + d.gap + ' years after his lessons.'))}`;
}

// ---------- bubble
function render(focus) {
  document.querySelectorAll('#topics button').forEach(b => b.setAttribute('aria-pressed', b.dataset.topic === state.topic));
  const b = $('#bubble'), q = state.list[state.idx]; const involved = new Set(); state.list.forEach(x => { involved.add(x.who); if (x.by === 'liszt') involved.add('liszt'); });
  document.querySelectorAll('.face,.med').forEach(n => { n.classList.remove('on'); n.classList.toggle('dim', state.list.length > 0 && !involved.has(n.dataset.p)); });
  if (!q) { b.className = ''; b.innerHTML = `<div class="tag">Weimar, the 1880s</div><div class="q">Liszt rarely told a pupil how to play a passage. He spoke in images.</div><div class="note">Choose a topic above, click a face, or take a disc from the piano.</div>`; anchor = null; sync(); return; }
  const isL = q.by === 'liszt', d = state.disc && DISCS.find(x => x.id === state.disc), t = TOPICS.find(x => x.id === state.topic);
  const head = isL ? `Liszt said, as ${esc(PEOPLE[q.who].name === 'Other witnesses' ? 'a witness' : PEOPLE[q.who].name)} reported it` : `${esc(q.who === 'others' ? 'A witness' : PEOPLE[q.who].name)} wrote`;
  b.className = isL ? 'liszt' : '';
  b.innerHTML = `<div class="tag">${t ? esc(t.label) + ' · ' : d ? esc(d.title) + ' · ' : ''}${head}</div><div class="q${q.text.length > 170 ? ' long' : ''}">“${esc(q.text)}”</div><div class="cite">${esc(q.cite)}</div>${q.note ? `<div class="note">${esc(q.note)}</div>` : ''}<div class="row">${state.list.length > 1 ? '<button type="button" class="alt" data-step="-1">Previous</button><button type="button" data-step="1">Next</button>' : ''}${q.disc && q.disc !== state.disc ? `<button type="button" data-disc="${q.disc}">♪ Hear ${esc(PEOPLE[DISCS.find(x => x.id === q.disc).player].short)} play it</button>` : ''}<span class="count">${state.idx + 1} of ${state.list.length}</span></div>`;
  anchor = isL ? 'liszt' : q.who; el(anchor).classList.add('on'); if (isL) el(q.who).classList.add('on'); el(anchor).classList.remove('dim');
  if (focus) b.querySelector('.q').focus?.(); sync(); drawTail();
}
let anchor = null;
function drawTail() {
  const ln = $('#tailLine'); if (!anchor || innerWidth <= 900) { ln.style.display = 'none'; return; } ln.style.display = '';
  const s = $('#stage').getBoundingClientRect(), a = (el(anchor).querySelector('.pic') || el(anchor)).getBoundingClientRect(), b = $('#bubble').getBoundingClientRect();
  const ax = a.left + a.width / 2 - s.left, ay = a.top + a.height / 2 - s.top, bx = Math.max(b.left + 30, Math.min(b.right - 30, a.left + a.width / 2)) - s.left, by = b.top - s.top;
  const ang = Math.atan2(by - ay, bx - ax), r = a.width / 2 + 4; ln.setAttribute('x1', ax + Math.cos(ang) * r); ln.setAttribute('y1', ay + Math.sin(ang) * r); ln.setAttribute('x2', bx); ln.setAttribute('y2', by);
}
function setTopic(id, idx = 0) { state.topic = id; state.list = TOPICS.find(t => t.id === id).quotes; state.idx = idx; render(true); }
function person(k) {
  const hit = q => q.who === k || (k === 'liszt' && q.by === 'liszt');
  if (state.list.length) { const n = state.list.length; for (let i = 1; i <= n; i++) { const j = (state.idx + i) % n; if (hit(state.list[j])) { state.idx = j; return render(true); } } }
  for (const t of TOPICS) { const j = t.quotes.findIndex(hit); if (j > -1) return setTopic(t.id, j); }
  const d = DISCS.find(x => x.player === k); if (d) playDisc(d.id);
}
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return; const d = b.dataset;
  if (d.topic) setTopic(d.topic); else if (d.p) person(d.p); else if (d.disc) playDisc(d.disc);
  else if (d.step) { state.idx = (state.idx + +d.step + state.list.length) % state.list.length; render(true); }
});
function modal(html) { $('#modalBody').innerHTML = html; $('#modal').classList.remove('hidden'); $('#closeModal').focus(); }
const closeModal = () => $('#modal').classList.add('hidden');
$('#closeModal').addEventListener('click', closeModal); $('#modal').addEventListener('click', e => { if (e.target.id === 'modal' || e.target.id === 'enter') closeModal(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
$('#aboutBtn').addEventListener('click', () => modal(`<h2 id="modalH">About and sources</h2>${ABOUT.map(([a, b]) => `<h3>${a}</h3><p>${esc(b)}</p>`).join('')}<h3>Sources</h3><ul>${LINKS.map(([t, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join('')}</ul><h3>People</h3><ul>${Object.values(PEOPLE).map(p => `<li><b>${esc(p.name)}.</b> ${esc(p.bio)}</li>`).join('')}</ul>`));
modal(`<h2 id="modalH">An Afternoon with Liszt</h2><p>Three afternoons a week, pupils gathered at Liszt’s house in Weimar. He charged nothing. He rarely told anyone how to play a passage. He spoke in images.</p><h3>What to do</h3><p>Pick a topic at the top. Each remark appears beside the person who reported it. Gold is Liszt speaking. Then take a disc from the piano and hear one of his pupils play.</p><button type="button" class="primary" id="enter">Enter</button>`);

// ---------- loop: bars + tail
const cv = $('#bars'), g = cv.getContext('2d');
function loop() {
  g.clearRect(0, 0, 220, 56);
  if (analyser && !audio.paused) { analyser.getByteFrequencyData(buf); for (let i = 0; i < 28; i++) { const h = Math.max(2, buf[i + 1] / 255 * 54); g.fillStyle = '#e0b25a'; g.fillRect(i * 8, 56 - h, 5, h); } }
  requestAnimationFrame(loop);
}
addEventListener('resize', drawTail); $('#group').addEventListener('load', drawTail); document.fonts?.ready.then(drawTail);
render(); loop();
window.__demo = { state, setTopic, person, playDisc, audio, TOPICS, DISCS };
