# Use-case recordings

`src/components/landing/UseCaseStrips.astro` (used by `src/pages/use-cases.astro`) renders a
`<video controls preload="none" playsinline>` under a strip only when the matching file exists
in `public/use-cases/` at build time; it is then served at `/use-cases/<file>`. None are copied yet:
the current renders use the old orange promo palette and need re-rendering in the shield
palette first.

| Expected file (in `public/use-cases/`) | Use case | Current source |
|---|---|---|
| `rocky-linux-image-mode-bare-metal.mp4` | 01 Rocky Linux on bare metal, from one registry | rendered from the promo kit (`poc/out/mirror-to-metal.mp4`) |
| `private-conda-channel-pixi.mp4` | 02 A private conda channel for pixi | rendered from the promo kit (`poc/out/conda.mp4`) |
| `ai-agent-dependency-guardrails.mp4` | 03 AI coding agents through one registry | rendered from the promo kit (`poc/out/agent.mp4`) |

## Docs page slot

`src/content/docs/docs/use-cases/off-grid-ai-stack.mdx` has a marked slot (an MDX comment and a
"Demo video: coming soon" note) for the off-grid AI stack demo, cut from the beats in
`off-grid-ai-stack/demo/SCRIPT.md` of artifact-keeper/walkthroughs. When the recording exists, put
it at `public/use-cases/off-grid-ai-stack.mp4` and replace the note with a
`<video controls preload="none" playsinline>` element pointing at `/use-cases/off-grid-ai-stack.mp4`.
