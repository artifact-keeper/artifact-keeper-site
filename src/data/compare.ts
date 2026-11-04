// Artifact Keeper vs JFrog Artifactory vs Sonatype Nexus Repository.
//
// Competitor cells come from public pages read on 2026-11-02:
//   JFrog pricing          https://jfrog.com/pricing/
//   JFrog self-managed     https://docs.jfrog.com/installation/docs/feature-comparison-matrix-for-self-mangaged-jpds
//   JFrog Nexus migrator   https://docs.jfrog.com/installation/docs/migrator-tool-overview
//   Sonatype tiers         https://help.sonatype.com/en/nexus-repository-tiers-and-feature-availability.html
//   Sonatype CE limits     https://help.sonatype.com/en/ce-onboarding.html
//   Sonatype formats       https://help.sonatype.com/en/formats.html
//   Sonatype migration     https://www.sonatype.com/ (JFrog Artifactory Migration Services datasheet)
// Artifact Keeper cells come from the docs under src/content/docs/docs.
// Keep each cell to one or two short sentences. Do not claim a competitor lacks
// something unless its own matrix says "not included".

export const compareAsOf = 'November 2026';

export interface CompareRow {
  category: string;
  ak: string;
  /** Optional link rendered after the Artifact Keeper cell text. */
  akLink?: { href: string; label: string };
  jfrog: string;
  sonatype: string;
}

export const compareColumns = {
  ak: 'Artifact Keeper',
  jfrog: 'JFrog Artifactory',
  sonatype: 'Sonatype Nexus Repository',
};

export const compareRows: CompareRow[] = [
  {
    category: 'License and editions',
    ak: 'MIT. One build with every feature. No tiers, no seat or server counts.',
    jfrog: 'Proprietary. The free OSS edition is Java only. Everything else is Pro X, Enterprise X or Enterprise+.',
    sonatype: 'Proprietary. Community Edition is free up to 40,000 components and 100,000 requests a day. Pro, Pro+ and Enterprise above that.',
  },
  {
    category: 'Package formats',
    ak: '38 native formats, 54 with client aliases, in every install. Add formats with WASM plugins.',
    jfrog: '60+ package types in paid editions. Five in the free edition: Maven, Gradle, Ivy, SBT and Generic.',
    sonatype: '27 formats listed in its docs, available in every edition.',
  },
  {
    category: 'Vulnerability scanning',
    ak: 'Trivy and Grype on upload, an A to F health score and CycloneDX or SPDX SBOMs. Included.',
    jfrog: 'JFrog Xray. Included from Pro X self-managed and Enterprise X cloud. Not in the free edition or the cloud Pro plan.',
    sonatype: 'Not part of the registry. Malicious-package and container protection start at Pro+. Repository Firewall and Lifecycle are separate products.',
  },
  {
    category: 'CVE blast radius',
    ak: 'Built in. One query returns which users and IPs pulled a vulnerable artifact, with counts and timestamps, across every format.',
    jfrog: 'Xray impact analysis maps a new CVE to the indexed artifacts, builds and release bundles that contain it.',
    sonatype: 'Sonatype Lifecycle search finds the applications that contain a vulnerable component. Separate product.',
  },
  {
    category: 'Supply-chain gates',
    ak: 'Age gate, curation rules and protected names ship in the registry. Policies run before a download is served.',
    jfrog: 'JFrog Curation, priced as an add-on.',
    sonatype: 'Sonatype Repository Firewall, a separate product.',
  },
  {
    category: 'Replication and edge',
    ak: 'Peer-to-peer mesh. Every peer is a full instance, transfers are chunked and resumable, no hub. Included.',
    jfrog: 'One-to-one replication from Pro X. Multi-site replication and federated repositories from Enterprise X. Edge nodes only in Enterprise+.',
    sonatype: 'Disaster-recovery replication in Pro and above. None in Community Edition.',
  },
  {
    category: 'High availability',
    ak: 'Run the Helm chart at three or more replicas against external PostgreSQL and S3. No edition gate.',
    jfrog: 'Enterprise X and above.',
    sonatype: 'Pro and above.',
  },
  {
    category: 'Single sign-on',
    ak: 'OIDC, SAML 2.0, LDAP and scoped API tokens, all active at the same time. Included.',
    jfrog: 'LDAP in the Pro plan. SAML from Pro X. Multiple providers from Enterprise X.',
    sonatype: 'LDAP in Community Edition. SAML and OIDC in Pro.',
  },
  {
    category: 'Migration tooling',
    ak: 'Built into the server. Reads Artifactory or Nexus over their APIs, resumes interrupted runs and verifies checksums.',
    jfrog: 'A separate Nexus-to-Artifactory migrator that you run on the Nexus host in Docker.',
    sonatype: 'A written guide plus a paid services engagement, typically four to eight weeks.',
  },
  {
    category: 'Self-hosted',
    ak: 'Docker Compose or Helm on your own hardware or cloud account. Same build, every feature.',
    jfrog: 'Self-managed Pro X, Enterprise X and Enterprise+, licensed per server.',
    sonatype: 'Community Edition or Pro, including an air-gapped option.',
  },
  {
    category: 'Managed cloud (SaaS)',
    ak: 'Artifact Keeper Cloud is in the works. Early access opens from the waitlist.',
    akLink: { href: '/cloud/', label: 'Join the waitlist' },
    jfrog: 'JFrog Cloud on AWS, Azure and Google Cloud. Pro from $150 a month with 25 GB base consumption. 99.9% uptime on Enterprise X, 99.99% on Enterprise+.',
    sonatype: 'Nexus Repository as a fully managed cloud service. Pricing by quote.',
  },
  {
    category: 'Support and services',
    ak: 'Community on GitHub. Enterprise support, migration help and managed hosting from OpenTeams.',
    jfrog: 'Community support on the Pro plan. 24/7 SLA support from Pro X self-managed and Enterprise X cloud. High-touch support on Enterprise+.',
    sonatype: 'Enterprise support with a Pro license. Migration from Artifactory as a paid services engagement.',
  },
  {
    category: 'List price',
    ak: '$0.',
    jfrog: 'Cloud from $150 a month (Pro) to $950 a month (Enterprise X). Self-managed from $27,000 a year (Pro X) and $51,000 a year (Enterprise X). Enterprise+ by quote.',
    sonatype: 'Community Edition free within its limits. Pro by quote.',
  },
];
