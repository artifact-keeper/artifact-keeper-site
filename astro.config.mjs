import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightClientMermaid from '@pasqal-io/starlight-client-mermaid';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://artifactkeeper.com',
  integrations: [
    starlight({
      title: 'Artifact Keeper',
      description: 'The open-source artifact registry. Documentation, guides, and API reference.',
      plugins: [starlightClientMermaid()],
      logo: {
        src: './src/assets/logo.png',
        replacesTitle: false,
      },
      favicon: '/favicon.png',
      social: {
        github: 'https://github.com/artifact-keeper',
      },
      customCss: ['./src/styles/custom.css'],
      disable404Route: true,
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Welcome', slug: 'docs' },
            { label: 'Architecture', slug: 'docs/getting-started/architecture' },
            { label: 'Quickstart', slug: 'docs/getting-started/quickstart' },
            { label: 'Installation', slug: 'docs/getting-started/installation' },
            { label: 'Configuration', slug: 'docs/getting-started/configuration' },
            { label: 'CLI Quick Start', slug: 'docs/guides/cli-quickstart' },
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
            { label: 'Helm Chart', slug: 'docs/deployment/helm' },
            { label: 'Kubernetes', slug: 'docs/deployment/kubernetes' },
            { label: 'Docker Compose', slug: 'docs/deployment/docker' },
            { label: 'Reverse Proxy & TLS', slug: 'docs/deployment/reverse-proxy' },
            { label: 'AWS', slug: 'docs/deployment/aws' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'REST API', slug: 'docs/reference/api' },
            { label: 'CLI Reference (ak)', slug: 'docs/reference/ak-cli' },
            { label: 'Client Configuration', slug: 'docs/reference/cli' },
            { label: 'Environment Variables', slug: 'docs/reference/environment' },
            { label: 'CI/CD Integration', slug: 'docs/guides/ci-cd' },
          ],
        },
      ],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
