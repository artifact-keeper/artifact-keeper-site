// Rasterises Natural Earth 110m land (world-atlas, TopoJSON) into a 0.5 degree lon/lat
// bitmask for the Community chapter globe (src/scripts/globe.ts). Run by hand when the
// source data changes: `npm run land-mask`. Not part of the site build.
//
// Output: src/data/land-mask.json = { w, h, bits } where bits is base64 of a row-major,
// MSB-first bit array. Row 0 is the northernmost band; cell (i, j) is centred on
// lon = -180 + (i + 0.5) * 360 / w, lat = 90 - (j + 0.5) * 180 / h.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { feature } from 'topojson-client';

const W = 720, H = 360;
const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../src/data/land-mask.json');
const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/land-110m.json'), 'utf8'));

const land = feature(topo, topo.objects.land);
const geoms = land.type === 'FeatureCollection' ? land.features.map((f) => f.geometry) : [land.geometry];
const polygons = geoms.flatMap((g) => (g.type === 'MultiPolygon' ? g.coordinates : g.type === 'Polygon' ? [g.coordinates] : []));

// Each polygon: its rings (outer + holes) and a latitude/longitude bounding box. A ring
// that jumps across the antimeridian is treated as spanning every longitude, since its
// unwrapped edges reach past the +-180 edge of the raw coordinates.
const polys = polygons.map((rings) => {
  let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180, seam = false;
  for (const ring of rings) {
    let prev = ring[ring.length - 1][0];
    for (const [lon, lat] of ring) {
      if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
      if (lon < minLon) minLon = lon; if (lon > maxLon) maxLon = lon;
      if (Math.abs(lon - prev) > 180) seam = true;
      prev = lon;
    }
  }
  if (seam) { minLon = -180; maxLon = 180; }
  return { rings, minLat, maxLat, minLon, maxLon };
});

// Even-odd ray casting over every ring of the polygon (holes toggle the point back out).
// The ray runs north along the point's meridian rather than east along its parallel.
// That keeps Antarctica right without a special case: its ring is cut at the antimeridian
// and wraps the whole globe, so it crosses each meridian once and everything south of
// its coast reads as inside.
//
// Rings cut at the antimeridian (Eurasia, Antarctica, Fiji, Wrangel) write the seam as
// -180 on one point and 180 on the next, and their coast edges leading into the seam
// jump nearly 360 degrees in longitude. Each edge is taken the short way round, so those
// become ordinary short edges ending on the seam, and the seam itself becomes a vertical
// edge that no meridian crosses.
function inside(rings, lon, lat) {
  let c = false;
  for (const ring of rings) {
    for (let k = 0, n = ring.length, m = n - 1; k < n; m = k++) {
      const [x1, y1] = ring[k];
      let [x2, y2] = ring[m];
      if (x2 - x1 > 180) x2 -= 360;
      else if (x1 - x2 > 180) x2 += 360;
      // An unwrapped edge can sit just beyond the +-180 edge of the map; follow it there.
      let x = lon;
      if (Math.min(x1, x2) < -180) x -= 360;
      else if (Math.max(x1, x2) > 180) x += 360;
      if ((x1 > x) === (x2 > x)) continue;
      if (y1 + ((y2 - y1) * (x - x1)) / (x2 - x1) > lat) c = !c;
    }
  }
  return c;
}

const bytes = new Uint8Array((W * H) / 8);
let count = 0;
for (let j = 0; j < H; j++) {
  const lat = 90 - ((j + 0.5) * 180) / H;
  // Nothing north of a polygon can be inside it (the ray would cross nothing); south of it
  // can (Antarctica), so only the northern bound filters.
  const rowPolys = polys.filter((p) => lat <= p.maxLat);
  if (!rowPolys.length) continue;
  for (let i = 0; i < W; i++) {
    const lon = -180 + ((i + 0.5) * 360) / W;
    let hit = false;
    for (const p of rowPolys) {
      if (lon < p.minLon || lon > p.maxLon) continue; // no meridian crossing outside the box
      if (inside(p.rings, lon, lat)) { hit = true; break; }
    }
    if (hit) { const b = j * W + i; bytes[b >> 3] |= 0x80 >> (b & 7); count++; }
  }
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ w: W, h: H, bits: Buffer.from(bytes).toString('base64') }) + '\n');
console.log(`land-mask: ${polys.length} polygons, ${count} of ${W * H} cells land (${((100 * count) / (W * H)).toFixed(1)}%) -> ${out}`);
