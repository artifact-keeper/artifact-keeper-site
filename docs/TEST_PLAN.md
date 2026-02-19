# Documentation Site Test Plan

## Overview

The artifact-keeper documentation site uses Astro with Starlight theme. Testing focuses on build verification and content quality.

## Test Inventory

| Test Type | Framework | Count | CI Job | Status |
|-----------|-----------|-------|--------|--------|
| Build | Astro | Full site | `build` | Active |
| Link check | (none) | 0 | - | Missing |
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

## CI Pipeline

```
Push to main
  -> build (npm ci + npm run build)
  -> deploy (GitHub Pages)
```

## Gaps and Roadmap

| Gap | Recommendation | Priority |
|-----|---------------|----------|
| No link checking | Add lychee for broken link detection | P2 |
| No performance testing | Add Lighthouse CI for page performance scores | P3 |
| No spell checking | Add cspell for content quality | P3 |
