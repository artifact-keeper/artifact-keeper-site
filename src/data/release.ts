// The Artifact Keeper release the landing pages show (hero, proof row, footer, "Coming in"
// notices), read at build time from the latest GitHub release so it never needs a manual bump.
// Any network or shape failure falls back to the committed snapshot so the build never fails
// offline, and the snapshot never moves the version backwards. A successful production build
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

export const LATEST_RELEASE_API = 'https://api.github.com/repos/artifact-keeper/artifact-keeper/releases/latest';
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

async function load(): Promise<Release> {
  const snapshot = snapshotJson as Release;
  try {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'artifact-keeper-site-build' };
    // Optional: the deploy workflow passes its token so shared runners don't hit the anonymous rate limit.
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(LATEST_RELEASE_API, { headers, signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const fresh = fromGitHub(await res.json());
    if (!fresh) throw new Error('latest release is not a vX.Y.Z tag with a publication date');
    if (compareVersions(fresh.version, snapshot.version) < 0) {
      throw new Error(`latest release ${fresh.version} is older than the snapshot`);
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
    console.warn(`[release] using committed snapshot ${snapshot.version}: ${(e as Error).message}`);
    return snapshot;
  }
}

// Astro can evaluate this module more than once per build; fetch (and log) only once per process.
const g = globalThis as typeof globalThis & { __akRelease?: Release };
if (!g.__akRelease) g.__akRelease = await load();

export const release: Release = g.__akRelease;
