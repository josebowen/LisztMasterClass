import { buildScene } from './scene.js';
import { SOURCES, KIND, PEOPLE, PIECES, TEACHING, ABOUT } from './content.js';

const $ = s => document.querySelector(s);
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const canvas = $('#c'), panel = $('#panel'), labels = $('#labels');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const S = buildScene(canvas);
const state = { view: 'home', id: null, tIndex: 0, answers: {}, played: {}, clipOk: {} };
const VIEW = { home: [0.32, 0.2], liszt: [-0.25, 0.16], lamond: [0.75, 0.14], dalbert: [0.5, 0.22], fay: [-0.45, 0.18], siloti: [-0.6, 0.14], piano: [0.15, 0.3] };

// ---------- audio
const audio = new Audio(); audio.preload = 'none'; let actx, analyser, buf, playing = null;
function setupAudio() { if (actx) return; try { actx = new (window.AudioContext || window.webkitAudioContext)(); const src = actx.createMediaElementSource(audio); analyser = actx.createAnalyser(); analyser.fftSize = 256; buf = new Uint8Array(analyser.frequencyBinCount); src.connect(analyser); analyser.connect(actx.destination); } catch (e) { actx = null; } }
function toggle(p) {
  setupAudio(); if (actx && actx.state === 'suspended') actx.resume();
  if (playing === p.id && !audio.paused) { audio.pause(); return; }
  if (playing !== p.id) { audio.src = p.clip; playing = p.id; }
  audio.play().then(() => { state.played[p.id] = true; state.clipOk[p.id] = true; }).catch(() => { state.clipOk[p.id] = false; playing = null; render(); });
}
audio.addEventListener('error', () => { if (playing) { state.clipOk[playing] = false; playing = null; render(); } });
['play', 'pause', 'ended'].forEach(e => audio.addEventListener(e, () => { if (e === 'ended') state.played[playing] = true; syncPlayer(e === 'ended'); }));
function syncPlayer(ended) { const b = $('#playBtn'); if (!b) return; b.textContent = audio.paused ? (ended ? 'Play again' : 'Play the clip') : 'Pause'; if (ended && !$('.ask')) render(); }

// ---------- panel
const tabs = () => `<nav class="tabs" aria-label="Sections">${[['home', 'The room'], ['teach', 'How Liszt taught'], ['pieces', 'The recordings'], ['about', 'About']].map(([k, l]) => `<button type="button" data-go="${k}" aria-pressed="${state.view === k || (k === 'pieces' && state.view === 'piece')}">${l}</button>`).join('')}</nav>`;
const src = k => SOURCES[k].u ? `<a href="${SOURCES[k].u}" target="_blank" rel="noopener">${esc(SOURCES[k].t)}</a>` : esc(SOURCES[k].t);
function quote(q) {
  return `<span class="kind ${q.kind}">${KIND[q.kind]}</span><blockquote${q.plain ? ' class="plain"' : ''}>${q.plain ? '' : '“'}${esc(q.text)}${q.plain ? '' : '”'}</blockquote><p class="cite">${esc(q.cite)}${q.who && PEOPLE[q.who] ? '' : ''}</p>${q.note ? `<p class="note">${esc(q.note)}</p>` : ''}`;
}
const pieceBtn = p => `<button type="button" class="item" data-piece="${p.id}"><b>${esc(p.composer)}: ${esc(p.title.split(',')[0])}</b><span>${esc(p.part)}. ${esc(PEOPLE[p.player].name)}, ${p.year}</span></button>`;
function viewHome() { return `<h2>The room</h2><p class="sub">Click a person or the piano in the room, or choose below.</p><h3>People</h3>${Object.entries(PEOPLE).map(([k, p]) => `<button type="button" class="item" data-person="${k}"><b>${esc(p.name)}${p.recorded ? ' ♪' : ''}</b><span>${p.dates}. ${esc(p.role)}</span></button>`).join('')}<p class="sub">♪ made recordings you can hear.</p>`; }
function viewTeach() { const q = TEACHING[state.tIndex]; return `<h2>How Liszt taught</h2><p class="sub">Liszt speaks in images. ${state.tIndex + 1} of ${TEACHING.length}.</p><h3>${esc(q.head)}</h3><blockquote${q.plain ? ' class="plain"' : ''}>${q.plain ? '' : '“'}${esc(q.text)}${q.plain ? '' : '”'}</blockquote><p class="cite">${esc(q.who)}. ${esc(q.cite)}</p><p style="margin-top:20px;display:flex;gap:8px"><button type="button" data-t="-1">Previous</button><button type="button" class="primary" data-t="1">Next remark</button></p><h3>Hear his pupils</h3>${PIECES.slice(0, 3).map(pieceBtn).join('')}`; }
function viewPieces(list, title, sub) { return `<h2>${title}</h2><p class="sub">${sub}</p>${list.map(pieceBtn).join('')}`; }
function viewPerson(id) {
  const p = PEOPLE[id]; let h = `<h2>${esc(p.name)}</h2><p class="sub">${p.dates}. ${esc(p.role)}</p>`;
  const own = PIECES.filter(x => x.player === id); if (own.length) h += `<h3>Recordings</h3>${own.map(pieceBtn).join('')}`;
  const told = []; PIECES.forEach(x => x.said.forEach(q => { if (q.who === id && !told.some(t => t.q.text === q.text)) told.push({ q, x }); }));
  if (told.length) h += `<h3>What ${esc(p.name.split(' ').pop())} reported</h3>` + told.map(({ q, x }) => `<blockquote>“${esc(q.text)}”</blockquote><p class="cite">${esc(q.cite)}</p>${q.note ? `<p class="note">${esc(q.note)}</p>` : ''}${x.said.indexOf(q) > -1 && q.kind !== 'general' && q.kind !== 'composer' ? `<p class="note"><button type="button" data-piece="${x.id}">Hear ${esc(PEOPLE[x.player].name)} play this</button></p>` : ''}`).join('');
  return h;
}
function viewPiece(id) {
  const p = PIECES.find(x => x.id === id), pl = PEOPLE[p.player], ok = state.clipOk[id] !== false;
  let h = `<h2>${esc(p.composer)}</h2><p class="sub">${esc(p.title)}. ${esc(p.part)}.</p><div class="player">`;
  h += ok ? `<div class="row"><button type="button" class="primary" id="playBtn" data-play="${id}">${playing === id && !audio.paused ? 'Pause' : 'Play the clip'}</button><div class="bar" aria-hidden="true"><i id="prog"></i></div></div>` : `<p style="margin:0">This clip has not been added to the site yet. <a href="${SOURCES[p.src].u}" target="_blank" rel="noopener">Hear the full side at the Internet Archive.</a></p>`;
  h += `<p class="meta">${esc(pl.name)}, piano. ${esc(p.label)}, recorded ${p.year}. He was ${p.age}. He first played for Liszt about ${p.gap} years earlier.</p></div>`;
  h += `<h3>What Liszt said</h3>` + p.said.map(quote).join('');
  if (state.played[id]) { const a = state.answers[id]; h += `<div class="ask"><b>Your ear. Not scored.</b><div>Does this playing fit what you just read?</div><div class="opts">${['Yes', 'In part', 'No'].map(o => `<button type="button" data-ans="${o}" aria-pressed="${a === o}">${o}</button>`).join('')}</div>${a ? `<p>You said: ${a}. ${esc(pl.name)} made this disc ${p.gap} years after his lessons, on a machine that held about four minutes a side. Liszt never heard it.</p>` : ''}</div>`; }
  h += `<p style="margin-top:22px"><button type="button" data-go="pieces">All recordings</button></p>`; return h;
}
function viewAbout() { return `<h2>About and sources</h2>${ABOUT.map(([a, b]) => `<h3>${a}</h3><p style="margin:0">${esc(b)}</p>`).join('')}<h3>Sources</h3><ul class="src">${Object.keys(SOURCES).map(k => `<li>${src(k)}</li>`).join('')}</ul>`; }
function render(focus) {
  let h; const v = state.view;
  if (v === 'home') h = viewHome(); else if (v === 'teach') h = viewTeach(); else if (v === 'about') h = viewAbout();
  else if (v === 'pieces') h = viewPieces(PIECES, 'The recordings', 'Five clips. Two pupils. Discs from 1912 and 1922.');
  else if (v === 'piece') h = viewPiece(state.id); else h = viewPerson(state.id);
  panel.innerHTML = tabs() + h; if (focus) { panel.scrollTop = 0; const t = panel.querySelector('h2'); t.tabIndex = -1; t.focus({ preventScroll: true }); }
  const sel = v === 'teach' ? 'liszt' : v === 'piece' ? PIECES.find(x => x.id === state.id).player : v === 'person' ? state.id : v === 'pieces' ? 'piano' : null;
  S.select(sel); const cam = VIEW[sel || 'home']; S.rig.gy = cam[0]; S.rig.gp = cam[1];
}
function go(view, id) { if (state.view === 'piece' && (view !== 'piece' || id !== state.id)) audio.pause(); state.view = view; state.id = id || null; render(true); }
function openPerson(id) { if (id === 'liszt') go('teach'); else if (id === 'piano') go('pieces'); else go('person', id); }
panel.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return; const d = b.dataset;
  if (d.go) go(d.go); else if (d.person) openPerson(d.person); else if (d.piece) go('piece', d.piece);
  else if (d.t) { state.tIndex = (state.tIndex + +d.t + TEACHING.length) % TEACHING.length; render(true); }
  else if (d.play) toggle(PIECES.find(x => x.id === d.play)); else if (d.ans) { state.answers[state.id] = d.ans; render(); }
});
$('#aboutBtn').addEventListener('click', () => go('about'));
$('#enter').addEventListener('click', () => { $('#intro').classList.add('hidden'); setupAudio(); render(true); });

// ---------- scene interaction
const names = { liszt: 'Liszt', lamond: 'Lamond', dalbert: 'd’Albert', fay: 'Amy Fay', siloti: 'Siloti', piano: 'The recordings' };
S.ids.forEach(id => { const s = document.createElement('span'); s.dataset.id = id; s.innerHTML = names[id] + (PEOPLE[id] && PEOPLE[id].recorded ? '<i>♪</i>' : ''); labels.appendChild(s); });
let down = null;
canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, yaw: S.rig.gy, pitch: S.rig.gp, moved: false }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - down.x, dy = e.clientY - down.y; if (Math.abs(dx) + Math.abs(dy) > 6) down.moved = true; S.rig.gy = Math.max(-0.9, Math.min(0.95, down.yaw - dx * 0.005)); S.rig.gp = Math.max(0.05, Math.min(0.5, down.pitch + dy * 0.003)); });
canvas.addEventListener('pointerup', e => { if (down && !down.moved) { const id = S.pick(e.clientX, e.clientY); if (id) openPerson(id); } down = null; });
function layout() { const w = innerWidth, h = innerHeight, mobile = w <= 820; S.resize(w, h, mobile ? 0 : 440, mobile ? h * 0.54 : 0); }
addEventListener('resize', layout); layout();

let last = performance.now(), cap = +(new URLSearchParams(location.search).get('dtcap') || 0.1);
function loop(now) {
  const dt = Math.min(cap, (now - last) / 1000); last = now; let lv = 0;
  if (analyser && !audio.paused) { analyser.getByteFrequencyData(buf); let s = 0; for (let i = 2; i < 48; i++) s += buf[i]; lv = Math.min(1, s / 46 / 110); }
  S.setLevel(lv); S.frame(dt, reduce);
  const pr = $('#prog'); if (pr && audio.duration) pr.style.width = (audio.currentTime / audio.duration * 100) + '%';
  const mobile = innerWidth <= 820, topLimit = 54, bottom = mobile ? innerHeight * 0.46 : innerHeight, right = mobile ? innerWidth : innerWidth - 440;
  for (const s of labels.children) { const p = S.screenPos(s.dataset.id); const hide = p.behind || p.y < topLimit || p.y > bottom || p.x > right - 20 || p.x < 20; s.style.opacity = hide ? 0 : 1; s.style.left = p.x + 'px'; s.style.top = p.y + 'px'; s.classList.toggle('on', s.dataset.id === (state.view === 'teach' ? 'liszt' : state.id)); }
  requestAnimationFrame(loop);
}
render(); requestAnimationFrame(loop);
window.__demo = { state, go, openPerson, render, toggle: id => toggle(PIECES.find(x => x.id === id)), view: () => state.view, audio, markPlayed: id => { state.played[id] = true; render(); } };
