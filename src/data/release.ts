// The Artifact Keeper release the landing pages show (hero, proof row, footer, "Coming in"
// notices): the highest stable vX.Y.Z among the recent GitHub releases, read at build time so it
// never needs a manual bump. Not `releases/latest`: patches on an older line (a 1.11.x after a
// 1.12.x) are published later and GitHub would call them latest.
// If the API fails, the build keeps what the live site already shows (/release.json), then the
// committed snapshot, so an API outage never moves the site backwards and an offline build never
// fails. The version never goes below the snapshot. A successful production build
// refreshes the snapshot on disk, like src/data/stats.ts.
// .github/workflows/release-check.yml redeploys the site when a newer release is published.
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import snapshotJson from './release-snapshot.json';

export interface Release {
  /** Tag of the release, e.g. `v1.12.3`. */
  version: string;
  /** Publication date, `YYYY-MM-DD` (UTC). */
  date: string;
}

export const RELEASES_API = 'https://api.github.com/repos/artifact-keeper/artifact-keeper/releases?per_page=30';
const LIVE_RELEASE_URL = 'https://artifactkeeper.com/release.json';
const SNAPSHOT_PATH = join(process.cwd(), 'src/data/release-snapshot.json');
const TAG = /^v\d+\.\d+\.\d+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const parts = (v: string) => v.replace(/^v/, '').split('.').map((n) => parseInt(n, 10) || 0);

/** Negative, zero or positive as `a` is older than, the same as, or newer than `b`. */
export function compareVersions(a: string, b: string): number {
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < 3; i++) {
    const d = (x[i] ?? 0) - (y[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

/** A GitHub release object as a Release, or null if it is not a plain vX.Y.Z release. */
export function fromGitHub(body: unknown): Release | null {
  const r = body as { tag_name?: unknown; published_at?: unknown; draft?: unknown; prerelease?: unknown };
  if (typeof r?.tag_name !== 'string' || !TAG.test(r.tag_name) || r.draft || r.prerelease) return null;
  const date = typeof r.published_at === 'string' ? r.published_at.slice(0, 10) : '';
  return DATE.test(date) ? { version: r.tag_name, date } : null;
}

/** The highest stable release in a GitHub releases list, or null if there is none. */
export function highest(body: unknown): Release | null {
  if (!Array.isArray(body)) return null;
  let best: Release | null = null;
  for (const item of body) {
    const r = fromGitHub(item);
    if (r && (!best || compareVersions(r.version, best.version) > 0)) best = r;
  }
  return best;
}

/** What the deployed site shows, if it is reachable and newer than `floor`. */
async function liveRelease(floor: Release): Promise<Release | null> {
  try {
    const res = await fetch(LIVE_RELEASE_URL, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return null;
    const r = (await res.json()) as Partial<Release>;
    const ok = typeof r.version === 'string' && TAG.test(r.version) && typeof r.date === 'string' && DATE.test(r.date);
    return ok && compareVersions(r.version!, floor.version) > 0 ? { version: r.version!, date: r.date! } : null;
  } catch {
    return null;
  }
}

async function load(): Promise<Release> {
  const snapshot = snapshotJson as Release;
  try {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'artifact-keeper-site-build' };
    // Optional: the deploy workflow passes its token so shared runners don't hit the anonymous rate limit.
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(RELEASES_API, { headers, signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const fresh = highest(await res.json());
    if (!fresh) throw new Error('no stable vX.Y.Z release with a publication date');
    if (compareVersions(fresh.version, snapshot.version) < 0) {
      throw new Error(`highest release ${fresh.version} is older than the snapshot`);
    }
    if (import.meta.env.PROD && (fresh.version !== snapshot.version || fresh.date !== snapshot.date)) {
      try {
        await writeFile(SNAPSHOT_PATH, JSON.stringify(fresh, null, 2) + '\n');
      } catch {
        /* read-only checkout: the in-memory release is still fresh */
      }
    }
    return fresh;
  } catch (e) {
    const live = await liveRelease(snapshot);
    const used = live ?? snapshot;
    console.warn(`[release] using ${live ? 'the live site\'s' : 'committed snapshot'} ${used.version}: ${(e as Error).message}`);
    return used;
  }
}

// Astro can evaluate this module more than once per build; fetch (and log) only once per process.
const g = globalThis as typeof globalThis & { __akRelease?: Release };
if (!g.__akRelease) g.__akRelease = await load();

export const release: Release = g.__akRelease;
