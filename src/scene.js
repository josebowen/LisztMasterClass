import * as THREE from 'three';

const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.75, ...o });
const box = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }

export function buildScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.4;
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x1a1410);
  scene.fog = new THREE.Fog(0x1a1410, 14, 30);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);

  // floor: parquet
  const floorTex = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#6b4a2b'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 4; x++) { const o = (y % 2) * 64; g.fillStyle = `hsl(28,${38 + ((x * 7 + y * 13) % 12)}%,${26 + ((x * 5 + y * 3) % 9)}%)`; g.fillRect(x * 128 + o - 64, y * 64, 126, 62); g.fillRect(x * 128 + o - 64 + 512, y * 64, 126, 62); }
  });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(5, 4);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 11), M(0xffffff, { map: floorTex, roughness: 0.45 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  // walls: patterned green paper over white dado
  const wallTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#2f5a45'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(210,190,120,.22)'; g.lineWidth = 2;
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const cx = x * 64 + (y % 2) * 32, cy = y * 64 + 32; g.beginPath(); g.moveTo(cx, cy - 22); g.quadraticCurveTo(cx + 18, cy, cx, cy + 22); g.quadraticCurveTo(cx - 18, cy, cx, cy - 22); g.stroke(); }
  });
  wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping; wallTex.repeat.set(7, 2.2);
  const wallM = M(0xffffff, { map: wallTex, roughness: 0.9 }), dadoM = M(0xe9e2d2), woodM = M(0x4a2f1c, { roughness: 0.5 });
  const H = 4.2;
  function wall(w, x, z, ry) { const g = new THREE.Group(); const a = box(w, H - 1, 0.12, wallM); a.position.y = 1 + (H - 1) / 2; const d = box(w, 1, 0.16, dadoM); d.position.y = 0.5; const r = box(w, 0.07, 0.2, woodM); r.position.y = 1.02; const c = box(w, 0.18, 0.24, dadoM); c.position.y = H - 0.09; g.add(a, d, r, c); g.position.set(x, 0, z); g.rotation.y = ry; g.traverse(o => o.receiveShadow = true); scene.add(g); return g; }
  wall(14, 0, -5.5, 0); wall(11, -7, 0, Math.PI / 2); wall(11, 7, 0, -Math.PI / 2);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(14, 11), M(0xd8cfbb)); ceil.rotation.x = Math.PI / 2; ceil.position.y = H; scene.add(ceil);

  // windows on the left wall with drapes and light
  const glassM = new THREE.MeshBasicMaterial({ color: 0xfff3d6 }), drapeM = M(0x7a1f1f, { roughness: 0.95, side: THREE.DoubleSide });
  const shafts = [];
  [-2.6, 1.2].forEach(z => {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.6), glassM); w.position.set(-6.9, 2.35, z); w.rotation.y = Math.PI / 2; scene.add(w);
    for (let i = -1; i <= 1; i += 2) { const mull = box(0.05, 2.6, 0.05, dadoM); mull.position.set(-6.88, 2.35, z + i * 0.25); scene.add(mull); }
    const bar = box(0.05, 0.05, 1.5, dadoM); bar.position.set(-6.88, 2.6, z); scene.add(bar);
    [-1, 1].forEach(s => { const g = new THREE.PlaneGeometry(0.62, 3.1, 8, 1); const p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 22) * 0.05); g.computeVertexNormals(); const d = new THREE.Mesh(g, drapeM); d.position.set(-6.78, 2.2, z + s * 0.98); d.rotation.y = Math.PI / 2; d.castShadow = true; scene.add(d); });
    const pel = box(0.18, 0.5, 2.7, drapeM); pel.position.set(-6.8, 3.75, z); scene.add(pel);
    const sg = new THREE.PlaneGeometry(1.5, 7); const sh = new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ color: 0xffe2a8, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); sh.position.set(-4.4, 1.5, z); sh.rotation.set(0, 0, -0.62); sh.rotation.order = 'YZX'; shafts.push(sh); scene.add(sh);
  });
  const sun = new THREE.DirectionalLight(0xffdfae, 2.6); sun.position.set(-9, 6, -0.5); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, far: 30 }); sun.shadow.bias = -0.0004; scene.add(sun);
  scene.add(new THREE.HemisphereLight(0xfff1dc, 0x4a3828, 1.15));
  const lamp = new THREE.PointLight(0xffc98a, 14, 12, 2); lamp.position.set(0.5, 3.3, -0.5); scene.add(lamp);

  // chandelier
  const brass = M(0xb08a3c, { metalness: 0.9, roughness: 0.3 }); const ch = new THREE.Group();
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8), brass); rod.position.y = 0.4; ch.add(rod, new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), brass));
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; const arm = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.012, 6, 16, Math.PI), brass); arm.rotation.set(Math.PI, a, 0); arm.position.set(Math.cos(a) * 0.28, 0, -Math.sin(a) * 0.28); const fl = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffe6b0 })); fl.position.set(Math.cos(a) * 0.56, 0.1, -Math.sin(a) * 0.56); ch.add(arm, fl); }
  ch.position.set(0.5, H - 0.85, -0.5); scene.add(ch);

  // rug
  const rugTex = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#6e1d1d'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c9a45a'; g.lineWidth = 6; g.strokeRect(14, 14, w - 28, h - 28); g.lineWidth = 2; g.strokeRect(30, 30, w - 60, h - 60); g.fillStyle = '#23344f'; g.beginPath(); g.ellipse(w / 2, h / 2, 60, 80, 0, 0, 7); g.fill(); g.stroke(); });
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 3.6), M(0xffffff, { map: rugTex, roughness: 1 })); rug.rotation.x = -Math.PI / 2; rug.position.set(0.6, 0.01, 0.6); rug.receiveShadow = true; scene.add(rug);

  // grand piano
  const ebony = M(0x0d0b0a, { roughness: 0.18, metalness: 0.1 }); const piano = new THREE.Group();
  const shape = new THREE.Shape(); shape.moveTo(-0.75, 0); shape.lineTo(0.75, 0); shape.lineTo(0.75, 0.9); shape.bezierCurveTo(0.75, 1.5, 0.2, 1.5, 0.1, 2.0); shape.bezierCurveTo(0, 2.5, -0.75, 2.5, -0.75, 2.0); shape.lineTo(-0.75, 0);
  const bodyG = new THREE.ExtrudeGeometry(shape, { depth: 0.32, bevelEnabled: false }); bodyG.rotateX(-Math.PI / 2);
  const body = new THREE.Mesh(bodyG, ebony); body.position.y = 0.68; piano.add(body);
  const lidG = new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: false }); lidG.rotateX(-Math.PI / 2);
  const lid = new THREE.Mesh(lidG, ebony); lid.position.set(-0.75, 1.0, 0); lid.geometry.translate(0.75, 0, 0); lid.rotation.z = 0.5; piano.add(lid);
  const prop = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.75), brass); prop.position.set(0.5, 1.33, -1.0); prop.rotation.z = 0.25; piano.add(prop);
  const keybed = box(1.5, 0.1, 0.34, ebony); keybed.position.set(0, 0.74, 0.17); piano.add(keybed);
  const keysTex = canvasTex(520, 32, (g, w, h) => { g.fillStyle = '#f3ecd9'; g.fillRect(0, 0, w, h); g.strokeStyle = '#8a8272'; for (let i = 0; i <= 52; i++) { g.beginPath(); g.moveTo(i * 10, 0); g.lineTo(i * 10, h); g.stroke(); } g.fillStyle = '#111'; for (let i = 0; i < 52; i++) { const k = (i + 5) % 7; if (k !== 2 && k !== 6) g.fillRect(i * 10 + 7, 0, 6, 19); } });
  const keys = new THREE.Mesh(new THREE.PlaneGeometry(1.38, 0.16), new THREE.MeshStandardMaterial({ map: keysTex, roughness: 0.3, emissive: 0xffd9a0, emissiveIntensity: 0 })); keys.rotation.x = -Math.PI / 2; keys.position.set(0, 0.795, 0.22); piano.add(keys);
  const stand = box(0.7, 0.3, 0.02, ebony); stand.position.set(0, 1.15, -0.12); stand.rotation.x = -0.25; piano.add(stand);
  const sheet = box(0.5, 0.26, 0.005, M(0xf4ecd8)); sheet.position.set(0, 1.16, -0.1); sheet.rotation.x = -0.25; piano.add(sheet);
  [[-0.65, 0.2], [0.65, 0.2], [-0.2, -2.1]].forEach(([x, z]) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.68, 10), ebony); l.position.set(x, 0.34, z); piano.add(l); });
  const stool = new THREE.Group(); const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 20), M(0x5a1a1a)); seat.position.y = 0.5; const sl = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.12, 0.48, 10), woodM); sl.position.y = 0.24; stool.add(seat, sl); stool.position.set(0, 0, 0.75); piano.add(stool);
  piano.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  piano.position.set(0.2, 0, -0.9); piano.rotation.y = 0.5; scene.add(piano);

  // upright piano on back wall, bust, portrait
  const up = new THREE.Group(); const ub = box(1.5, 1.25, 0.6, M(0x3a2414, { roughness: 0.4 })); ub.position.y = 0.625; const uk = box(1.4, 0.06, 0.25, M(0xf1ead8)); uk.position.set(0, 0.72, 0.4); up.add(ub, uk); up.position.set(4.3, 0, -5.05); up.traverse(o => o.castShadow = true); scene.add(up);
  const ped = box(0.4, 1.2, 0.4, dadoM); ped.position.set(-3.6, 0.6, -5.0); const bust = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), M(0xe8e2d6)); bust.scale.y = 1.25; bust.position.set(-3.6, 1.5, -5.0); const sh2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.26, 0.22, 12), M(0xe8e2d6)); sh2.position.set(-3.6, 1.28, -5.0); scene.add(ped, bust, sh2);
  const portTex = canvasTex(128, 192, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#3b3024'); gr.addColorStop(1, '#17120d'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#0c0a09'; g.beginPath(); g.moveTo(40, h); g.lineTo(46, 80); g.quadraticCurveTo(64, 60, 82, 80); g.lineTo(88, h); g.fill(); g.fillStyle = '#c9b196'; g.beginPath(); g.ellipse(64, 56, 13, 17, 0, 0, 7); g.fill(); g.fillStyle = '#d9d6cf'; g.beginPath(); g.ellipse(64, 48, 17, 13, 0, Math.PI, 0); g.fill(); g.fillRect(47, 48, 6, 26); g.fillRect(75, 48, 6, 26); });
  const pframe = box(1.3, 1.9, 0.08, brass); pframe.position.set(0.8, 2.5, -5.4); const port = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.7), new THREE.MeshStandardMaterial({ map: portTex })); port.position.set(0.8, 2.5, -5.35); scene.add(pframe, port);
  [[-6.2, 3.6], [6.2, -2.4], [6.2, -3.6]].forEach(([x, z], i) => { const c = new THREE.Group(); const s = box(0.5, 0.06, 0.5, M(0x7a1f1f)); s.position.y = 0.48; const b = box(0.5, 0.6, 0.05, woodM); b.position.set(0, 0.8, -0.22); c.add(s, b); for (const [lx, lz] of [[-.2, -.2], [.2, -.2], [-.2, .2], [.2, .2]]) { const l = box(0.04, 0.48, 0.04, woodM); l.position.set(lx, 0.24, lz); c.add(l); } c.position.set(x, 0, z); c.rotation.y = i ? -2.2 : 2.3; c.traverse(o => o.castShadow = true); scene.add(c); });

  // people: simple period figures
  const figures = {};
  function person(id, x, z, ry, o) {
    const g = new THREE.Group(); const cloth = M(o.coat, { roughness: 0.85 }); const skin = M(0xd9b99a, { roughness: 0.7 });
    let lower; if (o.skirt) { lower = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.42, 0.95, 18), cloth); lower.position.y = 0.475; } else if (o.cassock) { lower = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.0, 18), cloth); lower.position.y = 0.5; } else { lower = new THREE.Group(); [-0.09, 0.09].forEach(dx => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.88, 10), M(0x1b1b1f)); l.position.set(dx, 0.44, 0); lower.add(l); }); }
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.2, 0.62, 16), cloth); torso.position.y = 1.2;
    const sh = new THREE.Mesh(new THREE.SphereGeometry(0.21, 16, 10), cloth); sh.scale.set(1.12, 0.5, 0.8); sh.position.y = 1.5;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 18, 14), skin); head.scale.y = 1.15; head.position.y = 1.72;
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.125, 18, 14, 0, Math.PI * 2, 0, o.long ? 2.0 : 1.5), M(o.hair, { roughness: 1 })); hair.position.y = 1.74; hair.rotation.x = -0.35; if (o.long) hair.scale.set(1.08, 1.3, 1.1);
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.62, 8), cloth); armL.position.set(-0.25, 1.2, 0.02); armL.rotation.z = -0.12; const armR = armL.clone(); armR.position.x = 0.25; armR.rotation.z = 0.12; if (o.point) { armR.rotation.set(-1.1, 0, 0.3); armR.position.set(0.25, 1.38, 0.22); }
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.36, 0.42, 40), new THREE.MeshBasicMaterial({ color: 0xf2c46a, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })); halo.rotation.x = -Math.PI / 2; halo.position.y = 0.02;
    g.add(lower, torso, sh, head, hair, armL, armR, halo); g.scale.setScalar(o.h || 1); g.position.set(x, 0, z); g.rotation.y = ry;
    g.traverse(m => { if (m.isMesh && m !== halo) { m.castShadow = true; m.userData.pid = id; } }); g.userData = { id, halo, head, base: ry }; scene.add(g); figures[id] = g; return g;
  }
  person('liszt', 1.75, 0.35, -2.2, { coat: 0x121214, cassock: true, hair: 0xe9e6e0, long: true, point: true, h: 1.04 });
  person('lamond', -1.5, 0.5, 1.3, { coat: 0x2b2a33, hair: 0x4a3524 });
  person('dalbert', -0.5, 1.9, 0.5, { coat: 0x3a2f28, hair: 0x2a1c12, long: true, h: 0.93 });
  person('fay', 2.9, 1.9, -0.9, { coat: 0x3d5a6e, skirt: true, hair: 0x5b3a22, h: 0.95 });
  person('siloti', 3.2, -0.9, -1.5, { coat: 0x24303a, hair: 0x6b4a2a, h: 1.06 });
  piano.traverse(m => { if (m.isMesh) m.userData.pid = 'piano'; });

  // dust motes + music particles
  const N = 260, mp = new Float32Array(N * 3); for (let i = 0; i < N; i++) { mp[i * 3] = -6 + Math.random() * 6; mp[i * 3 + 1] = Math.random() * 3.6; mp[i * 3 + 2] = -4 + Math.random() * 7; }
  const motes = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(mp, 3)), new THREE.PointsMaterial({ color: 0xffe9c0, size: 0.03, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })); scene.add(motes);
  const K = 90, np = new Float32Array(K * 3), life = new Float32Array(K).fill(0);
  const notes = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(np, 3)), new THREE.PointsMaterial({ color: 0xffc66b, size: 0.09, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })); scene.add(notes);
  const pianoTop = new THREE.Vector3(); let ni = 0;

  // camera rig
  const rig = { yaw: 0.32, pitch: 0.2, dist: 9.2, tx: 0.6, ty: 1.25, tz: -0.2, gy: 0.32, gp: 0.2, gd: 9.2 };
  let W = 1, Hh = 1, ox = 0, oy = 0;
  function resize(w, h, panelW, panelH) { W = w; Hh = h; renderer.setSize(w, h, false); camera.aspect = w / h; ox = -panelW / 2; oy = panelH / 2; camera.setViewOffset(w, h, ox, oy, w, h); camera.fov = (w - panelW) / (h - panelH) < 1 ? 62 : 42; rig.gd = (w - panelW) / (h - panelH) < 1 ? 12 : 9.2; camera.updateProjectionMatrix(); }
  const ray = new THREE.Raycaster(), v2 = new THREE.Vector2();
  function pick(cx, cy) { const r = canvas.getBoundingClientRect(); v2.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1); ray.setFromCamera(v2, camera); const hit = ray.intersectObjects(scene.children, true).find(h => h.object.userData.pid); return hit ? hit.object.userData.pid : null; }
  function screenPos(id) { const p = id === 'piano' ? new THREE.Vector3(0.2, 1.5, -1.6) : figures[id].position.clone().setY(2.0 * figures[id].scale.y); p.project(camera); return { x: (p.x + 1) / 2 * W, y: (1 - p.y) / 2 * Hh, behind: p.z > 1 }; }
  let sel = null, level = 0, t = 0;
  function frame(dt, reduce) {
    t += dt; rig.yaw += (rig.gy - rig.yaw) * Math.min(1, dt * 3); rig.pitch += (rig.gp - rig.pitch) * Math.min(1, dt * 3); rig.dist += (rig.gd - rig.dist) * Math.min(1, dt * 3);
    const yaw = rig.yaw + (reduce ? 0 : Math.sin(t * 0.12) * 0.03);
    camera.position.set(rig.tx + Math.sin(yaw) * Math.cos(rig.pitch) * rig.dist, rig.ty + Math.sin(rig.pitch) * rig.dist, rig.tz + Math.cos(yaw) * Math.cos(rig.pitch) * rig.dist); camera.lookAt(rig.tx, rig.ty, rig.tz);
    for (const id in figures) { const f = figures[id]; const on = id === sel; f.userData.halo.material.opacity += ((on ? 0.9 : 0.0) - f.userData.halo.material.opacity) * 0.15; if (!reduce) { f.rotation.y = f.userData.base + Math.sin(t * 0.5 + f.position.x) * 0.05; f.userData.head.rotation.x = Math.sin(t * 0.7 + f.position.z) * 0.05; } }
    keys.material.emissiveIntensity = level * 1.6; lamp.intensity = 14 + level * 10;
    if (!reduce) { const p = motes.geometry.attributes.position; for (let i = 0; i < N; i++) { p.array[i * 3 + 1] += dt * 0.03; if (p.array[i * 3 + 1] > 3.7) p.array[i * 3 + 1] = 0.1; } p.needsUpdate = true; }
    const q = notes.geometry.attributes.position; piano.localToWorld(pianoTop.set(0.1, 1.0, -0.9));
    if (level > 0.04 && !reduce) for (let k = 0; k < 1 + Math.floor(level * 4); k++) { life[ni] = 1; q.array[ni * 3] = pianoTop.x + (Math.random() - 0.5) * 0.9; q.array[ni * 3 + 1] = pianoTop.y; q.array[ni * 3 + 2] = pianoTop.z + (Math.random() - 0.5) * 0.9; ni = (ni + 1) % K; }
    for (let i = 0; i < K; i++) { if (life[i] > 0) { life[i] -= dt * 0.45; q.array[i * 3 + 1] += dt * (0.5 + level); q.array[i * 3] += Math.sin(t * 2 + i) * dt * 0.15; } else q.array[i * 3 + 1] = -5; } q.needsUpdate = true;
    renderer.render(scene, camera);
  }
  return { resize, pick, screenPos, frame, rig, select: id => { sel = id; }, setLevel: v => { level = v; }, ids: ['liszt', 'lamond', 'dalbert', 'fay', 'siloti', 'piano'] };
}
