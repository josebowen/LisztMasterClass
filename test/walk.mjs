import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
mkdirSync('test/out', { recursive: true });
const srv = createServer(async (q, s) => { try { const p = decodeURIComponent(q.url.split('?')[0]); const b = await readFile('.' + (p === '/' ? '/index.html' : p)); s.writeHead(200, { 'content-type': p.endsWith('.mp3') ? 'audio/mpeg' : 'text/html' }); s.end(b); } catch { s.writeHead(404); s.end(); } }).listen(8123);
const br = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const errs = [];
for (const [name, w, h] of [['desk', 1600, 900], ['phone', 390, 844]]) {
  const pg = await br.newPage(); await pg.setViewport({ width: w, height: h });
  pg.on('pageerror', e => errs.push(name + ' ' + e.message)); pg.on('console', m => { if (m.type() === 'error' && !/404|Failed to load resource/.test(m.text())) errs.push(name + ' console ' + m.text()); });
  await pg.goto('http://localhost:8123/?dtcap=0.3', { waitUntil: 'load' }); await new Promise(r => setTimeout(r, 1500));
  const shot = async n => { await new Promise(r => setTimeout(r, 1800)); await pg.screenshot({ path: `test/out/${name}-${n}.png` }); };
  await shot('0intro'); await pg.click('#enter'); await shot('1home');
  await pg.evaluate(() => [...document.querySelectorAll('[data-person]')].find(b => b.dataset.person === 'liszt').click()); await shot('2teach');
  for (let i = 0; i < 10; i++) await pg.evaluate(() => document.querySelector('[data-t="1"]').click());
  await pg.evaluate(() => __demo.openPerson('lamond')); await shot('3lamond');
  await pg.evaluate(() => document.querySelector('[data-piece="moon1"]').click()); await pg.evaluate(() => document.querySelector('#playBtn')?.click()); await shot('4piece');
  const st = await pg.evaluate(() => ({ ok: __demo.state.clipOk.moon1, t: __demo.audio.currentTime }));
  await pg.evaluate(() => __demo.markPlayed('moon1')); await pg.evaluate(() => document.querySelector('[data-ans="In part"]').click()); await shot('5asked');
  for (const p of ['dalbert', 'fay', 'siloti', 'piano']) { await pg.evaluate(p => __demo.openPerson(p), p); } await shot('6pieces');
  for (const id of ['moon3', 'source', 'waltz', 'weber']) await pg.evaluate(id => __demo.go('piece', id), id); await shot('7weber');
  await pg.click('#aboutBtn'); await shot('8about');
  const over = await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  console.log(name, 'clip', JSON.stringify(st), 'overflowX', over); await pg.close();
}
await br.close(); srv.close(); console.log('errors', errs.length, errs.slice(0, 5));
