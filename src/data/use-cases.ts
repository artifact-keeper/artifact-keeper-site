// The three recorded walkthroughs shown on /use-cases/ (full strips) and as a teaser on /.
// Copy is final (from the approved story page); `headline` picks the stat the teaser shows.

export interface UseCase {
  id: string;
  n: string;
  title: string;
  slug: string;
  claim: string;
  refuse: number;
  refuseText: string;
  stages: [string, string][];
  stats: [string, string][];
  run: string;
  headline: number;
}

export const LAB_NOTE = 'Numbers from a lab run; an example configuration, not a complete defense.';
export const useCases: UseCase[] = [
  { id: 'uc1', n: '01', title: 'Rocky Linux on bare metal, from one registry', slug: 'rocky-linux-image-mode-bare-metal',
    claim: 'One registry, from mirror to metal.', refuse: 4, refuseText: 'unsigned image refused',
    stages: [['Mirror', 'Rocky, EPEL, RKE2 and Docker Hub, proxied through one registry.'],
      ['Build', 'Base image, site package and edge image built only from those repositories.'],
      ['Sign', 'Every package and image signed. Signatures stored beside them.'],
      ['Install', 'A stock Rocky installer pulls the signed image. Kubernetes is up about three minutes later.'],
      ['Day 2', 'A signed release is a tag move, rollback built in.']],
    stats: [['~3 min', 'power-on to a signed, verified Kubernetes node'], ['7.8 MB', 'per node for a day-2 site update'], ['11 repos', 'RPMs, images, signatures and keys in one place']],
    run: 'Timings from a QEMU/KVM lab run.', headline: 0 },
  { id: 'uc2', n: '02', title: 'A private conda channel for pixi', slug: 'private-conda-channel-pixi',
    claim: 'A conda channel your security team can sign off on.', refuse: 2, refuseText: 'held at promotion: CVE, GPL license, no attestation',
    stages: [['Channels', 'Proxies conda-forge, PyPI and base images. Hosts your own packages.'],
      ['Publish', 'CI builds each package, signs an attestation with cosign, publishes to staging.'],
      ['Gate', 'A known vulnerability, a GPL license or a missing attestation keeps it out.'],
      ['Resolve', 'Developers see one channel. Internal names win, so a public package cannot shadow yours.'],
      ['Install', 'pixi still asks for conda-forge. Every request goes to the registry. The token stays out of your files.']],
    stats: [['790,178', 'records behind one virtual channel'], ['3 rules', 'CVEs, licenses and attestations gate promotion'], ['0', 'credentials in any manifest or lockfile']],
    run: 'Lab run on Artifact Keeper 1.11.0.', headline: 0 },
  { id: 'uc3', n: '03', title: 'AI coding agents through one registry', slug: 'ai-agent-dependency-guardrails',
    claim: 'Let the registry decide what reaches disk.', refuse: 2, refuseText: 'released 10 minutes ago: held in cooldown',
    stages: [['Sandbox', 'The sandbox reaches ak.internal and nothing else, even if the agent edits its config.'],
      ['Names', 'Names nobody reviewed, invented or look-alike, refused before any code is downloaded.'],
      ['Cooldown', 'Unpinned installs get the newest version that is old enough.'],
      ['Squat', 'A public package cannot take over an internal name, not even an MCP server.'],
      ['Vulns', 'Known-vulnerable versions refused. When the fix is too fresh, a person approves it.']],
    stats: [['1 host', 'the sandbox can reach (ak.internal)'], ['7 of 12', 'agent installs refused, each with a reason'], ['11', 'young versions skipped by one uv add']],
    run: 'Recorded on Artifact Keeper 1.11.7, 2026-10-27.', headline: 1 },
];
