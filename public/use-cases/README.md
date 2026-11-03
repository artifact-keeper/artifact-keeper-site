# Use-case recordings

`src/pages/use-cases.astro` renders a `<video controls preload="none" playsinline>` under a
strip only when the matching file exists in this folder at build time. None are copied yet:
the current renders use the old orange promo palette and need re-rendering in the shield
palette first.

| Expected file | Use case | Current source |
|---|---|---|
| `rocky-linux-image-mode-bare-metal.mp4` | 01 Rocky Linux on bare metal, from one registry | `/home/geraci/scratch/openteams/artifact-keeper-promotion/poc/out/mirror-to-metal.mp4` |
| `private-conda-channel-pixi.mp4` | 02 A private conda channel for pixi | `/home/geraci/scratch/openteams/artifact-keeper-promotion/poc/out/conda.mp4` |
| `ai-agent-dependency-guardrails.mp4` | 03 AI coding agents through one registry | `/home/geraci/scratch/openteams/artifact-keeper-promotion/poc/out/agent.mp4` |
