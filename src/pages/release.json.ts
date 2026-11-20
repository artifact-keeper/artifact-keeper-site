// The release this build of the site shows, for .github/workflows/release-check.yml.
import type { APIRoute } from 'astro';
import { release } from '../data/release';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(release) + '\n', { headers: { 'Content-Type': 'application/json' } });
