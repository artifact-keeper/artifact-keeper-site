# CLI Documentation Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a dedicated top-level "CLI (ak)" section on artifactkeeper.com with 8 pages covering all 29 commands, positioned right after Getting Started in the sidebar.

**Architecture:** Create 7 new MDX pages in `src/content/docs/docs/cli/`, move the existing quickstart page there, update the Astro sidebar config to add the new section and clean up the old references. Delete the old reference page.

**Tech Stack:** Astro Starlight, MDX, Astro components (Steps, Tabs, TabItem, Code)

---

### Task 1: Update Sidebar Configuration

**Files:**
- Modify: `astro.config.mjs:23-121`

**Step 1: Edit the sidebar**

Replace the entire `sidebar` array in `astro.config.mjs` with this updated version. Changes:
- Remove `{ label: 'CLI Quick Start', slug: 'docs/guides/cli-quickstart' }` from Getting Started
- Add new "CLI (ak)" section at position 2 with 8 items
- Remove `{ label: 'CLI Reference (ak)', slug: 'docs/reference/ak-cli' }` from Reference
- Rename "Client Configuration" to "Package Manager Configuration" in Reference

The new sidebar should be:

```javascript
sidebar: [
  {
    label: 'Getting Started',
    items: [
      { label: 'Welcome', slug: 'docs' },
      { label: 'Architecture', slug: 'docs/getting-started/architecture' },
      { label: 'Quickstart', slug: 'docs/getting-started/quickstart' },
      { label: 'Installation', slug: 'docs/getting-started/installation' },
      { label: 'Configuration', slug: 'docs/getting-started/configuration' },
    ],
  },
  {
    label: 'CLI (ak)',
    items: [
      { label: 'Quick Start', slug: 'docs/cli/quickstart' },
      { label: 'Installation', slug: 'docs/cli/installation' },
      { label: 'Core Commands', slug: 'docs/cli/core-commands' },
      { label: 'Security Commands', slug: 'docs/cli/security-commands' },
      { label: 'Governance Commands', slug: 'docs/cli/governance-commands' },
      { label: 'Federation Commands', slug: 'docs/cli/federation-commands' },
      { label: 'Admin Commands', slug: 'docs/cli/admin-commands' },
      { label: 'TUI Dashboard', slug: 'docs/cli/tui' },
    ],
  },
  {
    label: 'Package Formats',
    items: [
      { label: 'Overview', slug: 'docs/package-formats' },
      { label: 'Docker / OCI', slug: 'docs/guides/docker' },
      { label: 'Incus / LXC', slug: 'docs/guides/incus' },
      { label: 'Maven', slug: 'docs/guides/maven' },
      { label: 'npm', slug: 'docs/guides/npm' },
      { label: 'PyPI', slug: 'docs/guides/pypi' },
      { label: 'Cargo', slug: 'docs/guides/cargo' },
      { label: 'NuGet', slug: 'docs/guides/nuget' },
      { label: 'Go Modules', slug: 'docs/guides/go' },
      { label: 'RubyGems', slug: 'docs/guides/rubygems' },
      { label: 'Composer / PHP', slug: 'docs/guides/composer' },
      { label: 'Helm', slug: 'docs/guides/helm' },
      { label: 'Protobuf / BSR', slug: 'docs/guides/protobuf' },
      { label: 'C / C++', slug: 'docs/guides/cpp' },
      { label: 'System Packages', slug: 'docs/guides/system-packages' },
      { label: 'Infrastructure', slug: 'docs/guides/infrastructure' },
      { label: 'More Languages', slug: 'docs/guides/more-languages' },
      { label: 'More Formats', slug: 'docs/guides/more-formats' },
    ],
  },
  {
    label: 'Security',
    items: [
      { label: 'Vulnerability Scanning', slug: 'docs/security/scanning' },
      { label: 'OpenSCAP Compliance', slug: 'docs/security/openscap' },
      { label: 'SBOM & Dependency-Track', slug: 'docs/security/sbom' },
      { label: 'Health Scores', slug: 'docs/security/health-scores' },
      { label: 'Quality Gates', slug: 'docs/security/quality-gates' },
      { label: 'Security Policies', slug: 'docs/security/policies' },
      { label: 'Artifact Signing', slug: 'docs/security/signing' },
      { label: 'Container Hardening', slug: 'docs/security/container-hardening' },
      { label: 'Security Testing', slug: 'docs/security/red-team' },
    ],
  },
  {
    label: 'Migration',
    items: [
      { label: 'From Artifactory', slug: 'docs/migration/from-artifactory' },
      { label: 'From Nexus', slug: 'docs/migration/from-nexus' },
    ],
  },
  {
    label: 'Advanced',
    items: [
      { label: 'Remote & Virtual Repos', slug: 'docs/advanced/remote-virtual' },
      { label: 'Authentication & RBAC', slug: 'docs/advanced/auth' },
      { label: 'Staging & Promotion', slug: 'docs/advanced/staging-promotion' },
      { label: 'Storage Backends', slug: 'docs/advanced/storage' },
      { label: 'Peer Replication', slug: 'docs/advanced/edge-nodes' },
      { label: 'WASM Plugins', slug: 'docs/advanced/plugins' },
      { label: 'Lifecycle Policies', slug: 'docs/advanced/lifecycle' },
      { label: 'Webhooks', slug: 'docs/advanced/webhooks' },
      { label: 'Backup & Recovery', slug: 'docs/advanced/backup' },
    ],
  },
  {
    label: 'Monitoring & Observability',
    items: [
      { label: 'Health Checks', slug: 'docs/monitoring/health-checks' },
      { label: 'Distributed Tracing', slug: 'docs/monitoring/tracing' },
      { label: 'Prometheus Metrics', slug: 'docs/monitoring/metrics' },
    ],
  },
  {
    label: 'Deployment',
    items: [
      { label: 'Kubernetes (Helm)', slug: 'docs/deployment/helm' },
      { label: 'Docker Compose', slug: 'docs/deployment/docker' },
      { label: 'Reverse Proxy & TLS', slug: 'docs/deployment/reverse-proxy' },
      { label: 'AWS', slug: 'docs/deployment/aws' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { label: 'REST API', slug: 'docs/reference/api' },
      { label: 'Package Manager Configuration', slug: 'docs/reference/cli' },
      { label: 'Environment Variables', slug: 'docs/reference/environment' },
      { label: 'CI/CD Integration', slug: 'docs/guides/ci-cd' },
      { label: 'UI Gallery', slug: 'docs/ui-gallery' },
    ],
  },
],
```

**Step 2: Commit**

```bash
git add astro.config.mjs
git commit -m "docs: restructure sidebar with dedicated CLI section"
```

Note: The build will fail until the MDX files are created. That's expected.

---

### Task 2: Move Quick Start and Delete Old Reference

**Files:**
- Move: `src/content/docs/docs/guides/cli-quickstart.mdx` to `src/content/docs/docs/cli/quickstart.mdx`
- Delete: `src/content/docs/docs/reference/ak-cli.mdx`

**Step 1: Create the cli directory and move the quickstart**

```bash
mkdir -p src/content/docs/docs/cli
mv src/content/docs/docs/guides/cli-quickstart.mdx src/content/docs/docs/cli/quickstart.mdx
```

**Step 2: Update the frontmatter title in the moved file**

Change the title from `"CLI Quick Start"` to `"Quick Start"` (the sidebar already provides the "CLI (ak)" context).

Update the description line: Remove the em-dash from `Get up and running with \`ak\` — the Artifact Keeper CLI.` to `Get up and running with \`ak\`, the Artifact Keeper CLI.`

**Step 3: Delete the old reference page**

```bash
rm src/content/docs/docs/reference/ak-cli.mdx
```

**Step 4: Commit**

```bash
git add -A
git commit -m "docs: move CLI quickstart to cli/ section, remove old reference page"
```

---

### Task 3: Create Installation Page

**Files:**
- Create: `src/content/docs/docs/cli/installation.mdx`

**Step 1: Create the installation page**

This page consolidates all installation methods, shell completions, man pages, and environment variables. Content is drawn from the old ak-cli.mdx reference page and the CLI README.

The page should include:
- Frontmatter: title "Installation", description "Install the ak CLI on any platform"
- Import Tabs and TabItem from Starlight components
- 6 install methods in tabs: curl, Homebrew, Cargo, Snap, Docker, GitHub Releases
- Verify section with `ak --version` (expected output: `ak 1.0.0`)
- Shell Completions section with bash/zsh/fish/powershell examples
- Man Pages section with generation command
- Global Options table (--format, -q, --instance, --no-input, --color)
- Environment Variables table (AK_FORMAT, AK_INSTANCE, AK_TOKEN, AK_NO_INPUT, AK_COLOR, AK_CONFIG_DIR, NO_COLOR)
- Configuration section showing the TOML config format and keychain credential storage
- System Requirements note: Rust 1.86+ for building from source

**Step 2: Commit**

```bash
git add src/content/docs/docs/cli/installation.mdx
git commit -m "docs: add CLI installation page"
```

---

### Task 4: Create Core Commands Page

**Files:**
- Create: `src/content/docs/docs/cli/core-commands.mdx`

**Step 1: Create the core commands page**

This covers the foundational commands every user needs. For each command group, include a synopsis block, a flags/args table where relevant, and 2-3 examples.

Commands to document:
- `ak instance` (add, remove, list, use, info)
- `ak auth` (login, logout, whoami, switch, token create/list/revoke)
- `ak repo` (list, show, create, delete with --pkg-format and --repo-type flags)
- `ak artifact` (push, pull, list, info, delete, search, copy with cross-instance support)
- `ak config` (list, get, set, path)
- `ak doctor` (run all diagnostics)
- `ak setup` (auto, npm, pip, cargo, docker, maven, gradle, go, helm, nuget, cocoapods, swift)
- `ak completion` (bash, zsh, fish, powershell)
- `ak man-pages` (generate man pages to a directory)

**Step 2: Commit**

```bash
git add src/content/docs/docs/cli/core-commands.mdx
git commit -m "docs: add CLI core commands page"
```

---

### Task 5: Create Security Commands Page

**Files:**
- Create: `src/content/docs/docs/cli/security-commands.mdx`

**Step 1: Create the security commands page**

Commands to document (from v0.6 CHANGELOG):
- `ak scan` (run, list, show, dashboard, scores, finding ack/revoke, policy list/show/create/update/delete, security show/update)
- `ak sign` (key list/show/create/delete/revoke/rotate/export, config show/update/export-key)
- `ak sbom` (generate, show, list, get, delete, components, export, cve history/trends/update-status)
- `ak license` (policy list/show/create/delete, check)
- `ak dt` (status, project list/show/components/findings/violations/metrics/metrics-history, metrics, policies, analyze; alias: `ak dependency-track`)

For each, include synopsis, common flags, and practical examples. Emphasize CI-friendly features like `ak license check` and `ak quality-gate check` exiting non-zero on failure.

**Step 2: Commit**

```bash
git add src/content/docs/docs/cli/security-commands.mdx
git commit -m "docs: add CLI security commands page"
```

---

### Task 6: Create Governance Commands Page

**Files:**
- Create: `src/content/docs/docs/cli/governance-commands.mdx`

**Step 1: Create the governance commands page**

Commands to document (from v0.5 CHANGELOG):
- `ak group` (list, show, create, delete, add-member, remove-member)
- `ak permission` (list, create, delete with --target-type and --principal-type filters)
- `ak approval` (list, show, approve, reject with optional --notes)
- `ak promotion` (promote, rule list/create/delete, history)
- `ak quality-gate` (list, show, create, update, delete, check; alias: `ak qg`; `check` exits non-zero for CI)
- `ak lifecycle` (list, show, create, delete, preview, execute; preview supports dry-run)
- `ak label` (repo list, add key=value, remove key)

**Step 2: Commit**

```bash
git add src/content/docs/docs/cli/governance-commands.mdx
git commit -m "docs: add CLI governance commands page"
```

---

### Task 7: Create Federation Commands Page

**Files:**
- Create: `src/content/docs/docs/cli/federation-commands.mdx`

**Step 1: Create the federation commands page**

Commands to document:
- `ak peer` (list, show, create, delete, status, sync)
- `ak sso` (status, oidc show/configure, ldap show/configure, saml show/configure, test)
- `ak sync-policy` (list, show, create, update, delete)
- `ak webhook` (list, show, create, update, delete, test, history)

**Step 2: Commit**

```bash
git add src/content/docs/docs/cli/federation-commands.mdx
git commit -m "docs: add CLI federation commands page"
```

---

### Task 8: Create Admin Commands Page

**Files:**
- Create: `src/content/docs/docs/cli/admin-commands.mdx`

**Step 1: Create the admin commands page**

Commands to document:
- `ak admin` (backup list/create/restore, cleanup --audit-logs/--old-backups/--stale-peers, metrics, users list/create/delete/update/reset-password, plugins list/install/remove)
- `ak analytics` (summary, downloads, storage, top-repos, top-artifacts, trends)
- `ak profile` (show, update --email/--display-name)
- `ak totp` (setup, enable, disable, verify, status)
- `ak migrate` (--from-instance, --from-repo, --to-repo, --dry-run)

**Step 2: Commit**

```bash
git add src/content/docs/docs/cli/admin-commands.mdx
git commit -m "docs: add CLI admin commands page"
```

---

### Task 9: Create TUI Dashboard Page

**Files:**
- Create: `src/content/docs/docs/cli/tui.mdx`

**Step 1: Create the TUI page**

Document the interactive terminal UI:
- Launch: `ak tui`
- Layout: Three-panel view (instances, repositories, artifacts)
- Keyboard shortcuts table: hjkl/arrows for navigation, Tab to switch panels, / to search, s for global search, i for details, ? for help, q to quit, 1-4 or Tab to switch between panels (repos, artifacts, details, security)
- Global search (Meilisearch-powered): press `s`, results show name, repo, format, version, size with faceted sidebar
- Security panel: press `4`, shows security dashboard, recent scans, drill-down into findings
- Instance status: shows "online (N repos)" in green when healthy
- Credential caching: in-memory caching prevents repeated keychain prompts

**Step 2: Commit**

```bash
git add src/content/docs/docs/cli/tui.mdx
git commit -m "docs: add CLI TUI dashboard page"
```

---

### Task 10: Build Verification

**Step 1: Install dependencies (if needed)**

```bash
npm install
```

**Step 2: Build the site**

```bash
npm run build
```

Expected: Build completes with no errors. All 8 new pages resolve correctly.

**Step 3: Run dev server and spot-check**

```bash
npm run dev
```

Open http://localhost:4321/docs/cli/quickstart/ and verify:
- The "CLI (ak)" section appears in the sidebar at position 2
- All 8 pages load
- Navigation works between pages
- The old "CLI Quick Start" link in Getting Started is gone
- The old "CLI Reference (ak)" link in Reference is gone
- "Package Manager Configuration" label appears in Reference (was "Client Configuration")

**Step 4: Commit any fixes**

If the build reveals broken links or issues, fix and commit them.
