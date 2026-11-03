// Community chapter globe: a dotted Earth drawn on a plain 2D canvas (no WebGL, no
// third-party code), with a marker per place in artifact-keeper/stats geo.json.
// Loaded lazily by Community.astro; until it runs, or if the canvas cannot be used,
// the static SVG fallback in the markup stays.
//
// Land comes from src/data/land-mask.json, a 0.5 degree bitmask rasterised from
// Natural Earth by scripts/build-land-mask.mjs (`npm run land-mask`).
import mask from '../data/land-mask.json';

const DEG = Math.PI / 180;
const TILT = 0.28; // radians: the north is tipped towards the viewer
const LON0 = -35 * DEG; // first frame centred on the Atlantic: Europe and the Americas
const SPEED = 0.0035; // radians per 60 fps frame
const STEP = 1.25; // degrees between dots, kept even on the sphere (see buildDots)
const BUCKETS = 12; // alpha levels: one fill per level per frame
const LIGHT = (() => { const v = [-0.5, 0.6, 0.62], n = Math.hypot(...v); return v.map((c) => c / n); })();

// Dots on land, spaced evenly over the sphere: rows every STEP degrees of latitude,
// each row's longitude step widened by 1/cos(lat), and alternate rows offset by half
// a step so the pattern reads as a soft hex grid rather than lines of longitude.
function buildDots(): { x: Float32Array; y: Float32Array; z: Float32Array; n: number } {
  const bits = Uint8Array.from(atob(mask.bits), (c) => c.codePointAt(0) ?? 0);
  const land = (lat: number, lon: number) => {
    const i = Math.min(mask.w - 1, Math.floor(((lon + 180) / 360) * mask.w));
    const j = Math.min(mask.h - 1, Math.floor(((90 - lat) / 180) * mask.h));
    const b = j * mask.w + i;
    return (bits[b >> 3] & (0x80 >> (b & 7))) !== 0;
  };
  const xs: number[] = [], ys: number[] = [], zs: number[] = [];
  let row = 0;
  for (let lat = -90 + STEP / 2; lat < 90; lat += STEP, row++) {
    const c = Math.cos(lat * DEG);
    const count = Math.max(1, Math.round((360 / STEP) * c));
    const dl = 360 / count;
    for (let k = 0; k < count; k++) {
      const lon = -180 + (k + (row % 2 ? 0.5 : 0)) * dl;
      if (!land(lat, lon)) continue;
      // Unit vector: X east at lon 90, Y north, Z out of the screen at lon 0.
      xs.push(c * Math.sin(lon * DEG)); ys.push(Math.sin(lat * DEG)); zs.push(c * Math.cos(lon * DEG));
    }
  }
  return { x: Float32Array.from(xs), y: Float32Array.from(ys), z: Float32Array.from(zs), n: xs.length };
}

type Place = { x: number; y: number; z: number; r: number; halo: boolean };
function readPlaces(root: HTMLElement): Place[] {
  try {
    const raw = JSON.parse(root.closest('section')?.querySelector('#com-places')?.textContent || '[]') as [number, number, number, number][];
    const max = Math.max(1, ...raw.map((p) => p[2]));
    return raw
      .map(([lat, lon, total, contributors]) => {
        const c = Math.cos(lat * DEG);
        return {
          x: c * Math.sin(lon * DEG), y: Math.sin(lat * DEG), z: c * Math.cos(lon * DEG),
          r: 0.006 + 0.02 * Math.sqrt(total / max) + (contributors > 0 ? 0.004 : 0),
          halo: contributors > 0,
        };
      })
      .sort((a, b) => b.r - a.r); // big ones first so small neighbours stay visible
  } catch {
    return [];
  }
}

type Colours = { light: boolean; land: string; landAlpha: number; marker: string; core: string; edge: string; rim: string };
function readColours(): Colours {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  const light = document.documentElement.dataset.theme === 'light';
  return light
    ? { light, land: v('--accent-ink', '#0668CC'), landAlpha: 0.7, marker: v('--accent2', '#0891B2'), core: v('--panel', '#FFFFFF'), edge: v('--line', '#CFDCEC'), rim: v('--line2', '#B7C9E0') }
    : { light, land: v('--accent', '#087CF4'), landAlpha: 0.6, marker: v('--accent2', '#06D6E9'), core: v('--panel', '#0B2140'), edge: v('--bg2', '#06182E'), rim: v('--line2', '#24497A') };
}

export function initGlobe(root: HTMLElement, reduce: boolean): void {
  const canvas = root.querySelector('canvas');
  if (!canvas) return;
  try {
    start(root, canvas, reduce);
  } catch (e) {
    root.classList.remove('is-live');
    root.dataset.globe = `init-failed: ${(e as Error).message}`;
  }
}

function start(root: HTMLElement, canvas: HTMLCanvasElement, reduce: boolean): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no 2d context');

  const dots = buildDots();
  const places = readPlaces(root);
  const paths: Path2D[] = new Array(BUCKETS);
  let colours = readColours();
  let size = 0, dpr = 1, phi = 0;

  const resize = () => {
    const w = canvas.clientWidth || 560;
    const d = Math.min(window.devicePixelRatio || 1, 2);
    if (w === size && d === dpr) return false;
    size = w; dpr = d;
    canvas.width = canvas.height = Math.round(w * d);
    return true;
  };

  const draw = () => {
    const s = size, R = s * 0.48, cx = s / 2, cy = s / 2;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, s, s);

    // Sphere body and rim.
    const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.05, cx, cy, R);
    g.addColorStop(0, colours.core);
    g.addColorStop(1, colours.edge);
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = colours.rim;
    ctx.lineWidth = 1;
    ctx.stroke();

    // One rotation per frame: about the polar axis by the centre longitude, then the tilt.
    const lonC = LON0 - phi;
    const cp = Math.cos(lonC), sp = Math.sin(lonC), ct = Math.cos(TILT), st = Math.sin(TILT);
    const [lx, ly, lz] = LIGHT;
    const project = (X: number, Y: number, Z: number) => {
      const x1 = X * cp - Z * sp, z1 = Z * cp + X * sp;
      return { x: x1, y: Y * ct - z1 * st, z: z1 * ct + Y * st };
    };

    // Land dots, bucketed by brightness: the limb fades with z, a soft light from the upper left.
    const r = s * 0.0045;
    for (let b = 0; b < BUCKETS; b++) paths[b] = new Path2D();
    const { x: dx, y: dy, z: dz, n } = dots;
    for (let i = 0; i < n; i++) {
      const X = dx[i], Y = dy[i], Z = dz[i];
      const x1 = X * cp - Z * sp, z1 = Z * cp + X * sp;
      const z = z1 * ct + Y * st;
      if (z <= 0) continue;
      const y = Y * ct - z1 * st;
      const lit = x1 * lx + y * ly + z * lz;
      const a = (0.2 + 0.8 * z) * (0.65 + 0.35 * Math.max(0, lit));
      const b = Math.min(BUCKETS - 1, Math.trunc(a * BUCKETS));
      const px = cx + x1 * R, py = cy - y * R, p = paths[b];
      p.moveTo(px + r, py);
      p.arc(px, py, r, 0, Math.PI * 2);
    }
    ctx.fillStyle = colours.land;
    for (let b = 0; b < BUCKETS; b++) {
      ctx.globalAlpha = colours.landAlpha * ((b + 0.5) / BUCKETS);
      ctx.fill(paths[b]);
    }

    // Markers: halo first for places with contributors, then the dot; both fade at the limb.
    ctx.fillStyle = colours.marker;
    for (const m of places) {
      const q = project(m.x, m.y, m.z);
      if (q.z <= 0) continue;
      const px = cx + q.x * R, py = cy - q.y * R, mr = m.r * s, fade = 0.3 + 0.7 * q.z;
      if (m.halo) {
        ctx.globalAlpha = 0.16 * fade;
        ctx.beginPath(); ctx.arc(px, py, mr * 2.2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = (colours.light ? 0.85 : 0.9) * fade;
      ctx.beginPath(); ctx.arc(px, py, mr, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  let raf = 0, last = 0, visible = false, dragX: number | null = null;
  const tick = (t: number) => {
    const dt = last ? Math.min(t - last, 100) : 16.67;
    last = t;
    if (dragX === null) phi += SPEED * (dt / 16.67);
    draw();
    raf = requestAnimationFrame(tick);
  };
  const play = () => { if (!raf && !reduce && visible) { last = 0; raf = requestAnimationFrame(tick); } };
  const pause = () => {
    if (raf) { cancelAnimationFrame(raf); }
    raf = 0;
  };

  resize();
  draw();
  root.classList.add('is-live');
  root.dataset.globe = 'live';

  new IntersectionObserver((es) => {
    visible = es.some((e) => e.isIntersecting);
    if (visible) play(); else pause();
  }).observe(root);

  new ResizeObserver(() => { if (resize() && !raf) draw(); }).observe(canvas);

  new MutationObserver(() => { colours = readColours(); if (!raf) draw(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Drag to rotate. Vertical touch scrolling stays native (touch-action: pan-y in CSS).
  canvas.addEventListener('pointerdown', (e) => {
    dragX = e.clientX;
    canvas.setPointerCapture?.(e.pointerId);
    root.classList.add('dragging');
  });
  canvas.addEventListener('pointermove', (e) => {
    if (dragX === null) return;
    phi += (e.clientX - dragX) / 200;
    dragX = e.clientX;
    if (!raf) draw();
  });
  const end = () => { dragX = null; root.classList.remove('dragging'); };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
}
