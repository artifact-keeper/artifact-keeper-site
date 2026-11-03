# Documentation Site Test Plan

## Overview

The artifact-keeper documentation site uses Astro with Starlight theme. Testing focuses on build verification and content quality.

## Test Inventory

| Test Type | Framework | Count | CI Job | Status |
|-----------|-----------|-------|--------|--------|
| Build | Astro | Full site | `build` | Active (push to main and PRs) |
| Internal link check | lychee (`--offline`) | All `dist/**/*.html` | `build` | Active (fails the job) |
| Lighthouse | (none) | 0 | - | Missing |

## How to Run

### Build
```bash
npm ci && npm run build
```

### Local Dev
```bash
npm run dev
```

### Internal link check
Requires the [lychee](https://github.com/lycheeverse/lychee) binary. Run after a build:
```bash
lychee --offline --no-progress --index-files index.html --root-dir "$PWD/dist" 'dist/**/*.html'
```
`--offline` skips external URLs, so only internal links, images and assets are checked.
`--index-files index.html` requires a `/dir/` link to resolve to `dir/index.html`.

## CI Pipeline

```
Pull request to main
  -> build (npm ci + npm run build + lychee internal link check)
     reports the `build` check that .mergify.yml requires

Push to main
  -> build (npm ci + npm run build + lychee internal link check)
  -> deploy (GitHub Pages)
```

Workflow: `.github/workflows/deploy.yml` (Node 22). SonarCloud runs separately in `sonar.yml`.

## Gaps and Roadmap

| Gap | Recommendation | Priority |
|-----|---------------|----------|
| No external link checking | Scheduled lychee run without `--offline` (kept out of the PR gate to avoid flakiness) | P3 |
| No performance testing | Add Lighthouse CI for page performance scores | P3 |
| No spell checking | Add cspell for content quality | P3 |
