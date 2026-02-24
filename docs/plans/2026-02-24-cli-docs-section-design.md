# CLI Documentation Section - Design

## Goal

Create a dedicated top-level "CLI (ak)" section on artifactkeeper.com to showcase the v1.0 CLI. Move it to position 2 in the sidebar (right after Getting Started) to make it a first-class citizen of the documentation.

## Current State

- CLI Quick Start is buried as the last item in Getting Started
- CLI Reference (ak) is one page in the Reference section (position 8 of 9)
- The reference page only covers the original 12 command groups from v0.1, missing 17+ commands added in v0.5-v1.0
- "Client Configuration" label in Reference is confusing (it's actually package manager config)

## Design

### Navigation

New sidebar order:

1. Getting Started (5 items, CLI Quick Start removed)
2. **CLI (ak)** (8 items, new top-level section)
3. Package Formats (unchanged)
4. Security (unchanged)
5. Migration (unchanged)
6. Advanced (unchanged)
7. Monitoring & Observability (unchanged)
8. Deployment (unchanged)
9. Reference (5 items, CLI Reference removed, "Client Configuration" renamed to "Package Manager Configuration")

### Pages

8 new pages in `src/content/docs/docs/cli/`:

| Page | File | Content |
|------|------|---------|
| Quick Start | quickstart.mdx | Moved from guides/, updated for v1.0 |
| Installation | installation.mdx | Install methods, shell completions, man pages, env vars |
| Core Commands | core-commands.mdx | instance, auth, repo, artifact, config, doctor, setup, completion, man-pages |
| Security Commands | security-commands.mdx | scan, sign, sbom, license, dt |
| Governance Commands | governance-commands.mdx | group, permission, approval, promotion, quality-gate, lifecycle, label |
| Federation Commands | federation-commands.mdx | peer, sso, sync-policy, webhook |
| Admin Commands | admin-commands.mdx | admin, analytics, profile, totp, migrate |
| TUI Dashboard | tui.mdx | Interactive terminal UI, keyboard shortcuts, panels |

### Content Pattern

Each command page follows: brief section intro, then per command group: synopsis line, flags/args table, 2-3 real examples.

### File Changes

- **Modify:** `astro.config.mjs` (sidebar restructure)
- **Create:** 8 `.mdx` files in `src/content/docs/docs/cli/`
- **Delete:** `src/content/docs/docs/reference/ak-cli.mdx` (content redistributed)
- **Move:** `src/content/docs/docs/guides/cli-quickstart.mdx` to `src/content/docs/docs/cli/quickstart.mdx`
- **Rename label:** "Client Configuration" to "Package Manager Configuration" in sidebar
