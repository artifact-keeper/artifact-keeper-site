// Adoption numbers for the landing page's Community chapter, fetched at build time
// from artifact-keeper/stats. Any network or shape failure falls back to the committed
// snapshot so the build never fails offline. A successful production build refreshes
// the snapshot on disk so the committed fallback stays current.
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import snapshotJson from './stats-snapshot.json';
import { GEO_URL, LATEST_URL, normalize, type Place, type Snapshot, type Stats } from '../lib/stats-model';

const SNAPSHOT_PATH = join(process.cwd(), 'src/data/stats-snapshot.json');

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

async function load(): Promise<Snapshot> {
  try {
    const [latest, geo] = await Promise.all([getJson(LATEST_URL), getJson(GEO_URL)]);
    const fresh = normalize(latest, geo);
    if (import.meta.env.PROD) {
      try {
        const text = JSON.stringify(fresh, null, 2) + '\n';
        if (text !== JSON.stringify(snapshotJson, null, 2) + '\n') await writeFile(SNAPSHOT_PATH, text);
      } catch {
        /* read-only checkout: the in-memory numbers are still fresh */
      }
    }
    return fresh;
  } catch (e) {
    console.warn(`[stats] using committed snapshot (${(snapshotJson as Snapshot).updated}): ${(e as Error).message}`);
    return snapshotJson as Snapshot;
  }
}

// Astro can evaluate this module more than once per build; fetch (and log) only once per process.
const g = globalThis as typeof globalThis & { __akStats?: Snapshot };
let data = g.__akStats;
// Also guards against a stale value left on globalThis by an older module version during dev reloads.
if (!data?.metrics) {
  data = await load();
  g.__akStats = data;
}

export const stats: Stats = {
  updated: data.updated,
  metrics: data.metrics,
  countriesCount: data.countriesCount,
  peopleLocated: data.peopleLocated,
  topCountries: data.topCountries,
};
export const places: Place[] = data.places;
