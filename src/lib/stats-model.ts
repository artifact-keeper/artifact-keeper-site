// Shape and normaliser for the public adoption numbers published daily by
// https://github.com/artifact-keeper/stats (06:17 UTC). Pure: imported both by
// the build-time loader (src/data/stats.ts) and the landing page's client refresh.

export const STATS_REPO = 'https://github.com/artifact-keeper/stats';
export const STATS_GLOBE = 'https://artifact-keeper.github.io/stats/site/?project=artifact-keeper';
export const LATEST_URL = 'https://raw.githubusercontent.com/artifact-keeper/stats/main/latest.json';
export const GEO_URL = 'https://raw.githubusercontent.com/artifact-keeper/stats/main/data/artifact-keeper/geo.json';

export interface Metrics {
  stars: number;
  forks: number;
  contributors: number;
  dockerPulls: number;
  dockerPullsBackend: number;
  releaseDownloads: number;
  releases: number;
  mergedPrs: number;
}
export interface Country { code: string; name: string; people: number }
export interface Place { lat: number; lon: number; place: string; country_code: string; total: number; contributors: number }
export interface Stats {
  updated: string;
  metrics: Metrics;
  countriesCount: number;
  peopleLocated: number;
  topCountries: Country[];
}
export interface Snapshot extends Stats { places: Place[] }

const num = (v: unknown, key: string): number => {
  const n = typeof v === 'number' ? v : Number.NaN;
  if (!Number.isFinite(n) || n < 0) throw new Error(`stats: bad ${key}`);
  return n;
};

/** Validates the two raw files and reduces them to what the page shows. Throws on a malformed payload. */
export function normalize(latest: any, geo: any): Snapshot {
  const p = latest?.projects?.['artifact-keeper'];
  if (!p || typeof latest.updated !== 'string') throw new Error('stats: latest.json missing project');
  if (!Array.isArray(geo?.countries) || !Array.isArray(geo?.places)) throw new Error('stats: geo.json malformed');
  const metrics: Metrics = {
    stars: num(p.stars, 'stars'),
    forks: num(p.forks, 'forks'),
    contributors: num(p.contributors, 'contributors'),
    dockerPulls: num(p.docker_pulls_total, 'docker_pulls_total'),
    dockerPullsBackend: num(p['docker_pulls:artifactkeeper/backend'], 'docker_pulls:artifactkeeper/backend'),
    releaseDownloads: num(p.release_downloads, 'release_downloads'),
    releases: num(p.releases, 'releases'),
    mergedPrs: num(p.merged_prs, 'merged_prs'),
  };
  const countries: Country[] = geo.countries
    .filter((c: any) => c && typeof c.code === 'string' && Number(c.people) > 0)
    .map((c: any) => ({ code: c.code, name: String(c.name ?? c.code), people: Number(c.people) }))
    .sort((a: Country, b: Country) => b.people - a.people);
  const r3 = (v: number) => Math.round(v * 1000) / 1000;
  const places: Place[] = geo.places
    .map((x: any) => ({
      lat: r3(Number(x.lat)), lon: r3(Number(x.lon)), place: String(x.place ?? ''), country_code: String(x.country_code ?? ''),
      total: (Number(x.stargazers) || 0) + (Number(x.forkers) || 0) + (Number(x.contributors) || 0),
      contributors: Number(x.contributors) || 0,
    }))
    .filter((x: Place) => Number.isFinite(x.lat) && Number.isFinite(x.lon) && x.total > 0);
  return {
    updated: latest.updated,
    metrics,
    countriesCount: countries.length,
    peopleLocated: num(geo.people_located, 'people_located'),
    topCountries: countries.slice(0, 6),
    places,
  };
}

/** English country name from an ISO code, falling back to the name in the data. */
export function countryName(code: string, fallback: string): string {
  try {
    const n = new Intl.DisplayNames(['en'], { type: 'region' }).of(code);
    return n && n !== code ? n : fallback;
  } catch {
    return fallback;
  }
}

export const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US');
