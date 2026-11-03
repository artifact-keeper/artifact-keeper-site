// Community chapter globe: cobe (WebGL, MIT) dotted globe with a marker per place in
// artifact-keeper/stats geo.json. Loaded lazily by Community.astro. Without WebGL the
// static SVG fallback already in the markup stays, and nothing is thrown.
import createGlobe, { type COBEOptions, type Globe, type Marker } from 'cobe';

type RGB = [number, number, number];
const THEMES: Record<'dark' | 'light', Pick<COBEOptions, 'dark' | 'baseColor' | 'markerColor' | 'glowColor' | 'mapBrightness' | 'diffuse'>> = {
  dark: { dark: 1, baseColor: [0.15, 0.25, 0.43] as RGB, markerColor: [0.02, 0.84, 0.91] as RGB, glowColor: [0.05, 0.16, 0.36] as RGB, mapBrightness: 6, diffuse: 1.2 },
  light: { dark: 0, baseColor: [0.8, 0.87, 0.95] as RGB, markerColor: [0.03, 0.57, 0.7] as RGB, glowColor: [0.88, 0.93, 0.99] as RGB, mapBrightness: 10, diffuse: 1.3 },
};
const theme = () => THEMES[document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'];

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function readMarkers(root: HTMLElement): Marker[] {
  try {
    const raw = JSON.parse(root.closest('section')?.querySelector('#com-places')?.textContent || '[]') as [number, number, number, number][];
    const max = Math.max(1, ...raw.map((p) => p[2]));
    return raw.map(([lat, lon, total, contributors]) => ({
      location: [lat, lon] as [number, number],
      size: 0.012 + 0.04 * Math.sqrt(total / max) + (contributors > 0 ? 0.008 : 0),
    }));
  } catch {
    return [];
  }
}

export function initGlobe(root: HTMLElement, reduce: boolean): void {
  const canvas = root.querySelector('canvas');
  if (!canvas || !hasWebGL()) return;

  let globe: Globe;
  let phi = 4.9; // starts over the Atlantic: Europe and the Americas in view
  let size = canvas.offsetWidth || 560;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  try {
    globe = createGlobe(canvas, {
      devicePixelRatio: dpr, width: size, height: size, phi, theta: 0.28, mapSamples: 16000, scale: 1,
      markers: readMarkers(root), markerElevation: 0.01, ...theme(),
    } as COBEOptions);
  } catch {
    return;
  }

  let raf = 0, visible = false, dragX: number | null = null, dead = false;
  const draw = () => { try { globe.update({ phi }); } catch { stop(true); } };
  const tick = () => {
    if (dragX === null) { phi += 0.003; }
    draw();
    raf = requestAnimationFrame(tick);
  };
  const start = () => { if (!raf && !reduce && !dead) raf = requestAnimationFrame(tick); };
  function stop(kill = false) {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (kill && !dead) { dead = true; root.classList.remove('is-live'); try { globe.destroy(); } catch { /* already gone */ } }
  }
  // Static frames: the map texture loads asynchronously, so redraw once it can have arrived.
  const still = () => { draw(); setTimeout(draw, 250); setTimeout(draw, 1000); };

  draw();
  root.classList.add('is-live');
  if (reduce) still();

  new IntersectionObserver((es) => {
    visible = es.some((e) => e.isIntersecting);
    if (visible) start(); else stop();
  }).observe(root);

  new ResizeObserver(() => {
    const w = canvas.offsetWidth;
    if (!w || w === size || dead) return;
    size = w;
    try { globe.update({ width: w, height: w }); } catch { stop(true); }
    if (!raf) draw();
  }).observe(canvas);

  new MutationObserver(() => {
    if (dead) return;
    try { globe.update(theme()); } catch { stop(true); }
    if (!raf) draw();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  canvas.addEventListener('webglcontextlost', () => stop(true));

  // Drag to rotate, as in cobe's examples. Vertical touch scrolling stays native (touch-action: pan-y).
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
