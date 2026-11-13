import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
mkdirSync('test/out', { recursive: true });
const srv = createServer(async (q, s) => { try { const p = decodeURIComponent(q.url.split('?')[0]); const b = await readFile('.' + (p === '/' ? '/index.html' : p)); s.writeHead(200, { 'content-type': p.endsWith('.mp3') ? 'audio/mpeg' : p.endsWith('.jpg') ? 'image/jpeg' : 'text/html' }); s.end(b); } catch { s.writeHead(404); s.end(); } }).listen(8123);
const br = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
const errs = []; const wait = ms => new Promise(r => setTimeout(r, ms));
for (const [name, w, h] of [['desk', 1600, 900], ['lap', 1280, 720], ['phone', 390, 844]]) {
  const pg = await br.newPage(); await pg.setViewport({ width: w, height: h });
  pg.on('pageerror', e => errs.push(name + ' ' + e.message));
  await pg.goto('http://localhost:8123/', { waitUntil: 'load' }); await wait(1200);
  const shot = async n => { await wait(500); await pg.screenshot({ path: `test/out/${name}-${n}.png`, fullPage: name === 'phone' }); };
  await shot('0intro'); await pg.click('#enter'); await shot('1home');
  let seen = 0;
  for (const t of await pg.evaluate(() => __demo.TOPICS.map(t => [t.id, t.quotes.length]))) { await pg.click(`[data-topic="${t[0]}"]`); for (let i = 0; i < t[1]; i++) { seen++; const fits = await pg.evaluate(() => { const b = document.querySelector('#bubble').getBoundingClientRect(); return innerWidth <= 900 || (b.top > 60 && b.bottom < innerHeight); }); if (!fits) errs.push(`${name} bubble overflow ${t[0]} ${i}`); if (t[0] === 'beethoven' && i === 0) await shot('2beeth'); if (t[0] === 'images' && i === 1) await shot('3images'); if (t[1] > 1) await pg.click('[data-step="1"]'); } }
  await pg.click('[data-disc="source"]'); await wait(1500); await shot('4disc');
  const st = await pg.evaluate(() => ({ ok: __demo.state.clipOk.source, t: __demo.audio.currentTime }));
  for (const d of ['moon1', 'moon3', 'waltz', 'weber']) { await pg.click(`[data-disc="${d}"]`); await wait(300); }
  await pg.evaluate(() => __demo.person('fay')); await pg.evaluate(() => __demo.person('liszt')); await pg.evaluate(() => __demo.person('dalbert'));
  await pg.click('#aboutBtn'); await shot('5about');
  console.log(name, 'quotes', seen, 'clip', JSON.stringify(st), 'overflowX', await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth)); await pg.close();
}
await br.close(); srv.close(); console.log('errors', errs.length, errs.slice(0, 6));
