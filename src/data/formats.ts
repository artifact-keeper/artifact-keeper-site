// The 38 native package formats Artifact Keeper serves (docs: /docs/package-formats/).
// A format with `since` is not released yet: the landing pages count and show it only once
// `release` in site.ts reaches that version.
// `name` is the label shown on the landing page, `key` the repository format key,
// `logo` a Simple Icons slug in src/assets/format-logos/ (or null for a text tile `tile`).
// The marquee shows them in this order: row 1 is languages and schemas, row 2 the rest.

import { isReleased, nextRelease } from './site';

export type Category =
  | 'Languages'
  | 'Schemas'
  | 'Containers'
  | 'Infrastructure'
  | 'System packages'
  | 'C / C++'
  | 'ML / AI'
  | 'Editor extensions'
  | 'Other';

export interface Format {
  name: string;
  key: string;
  category: Category;
  clients: string[];
  logo: string | null;
  tile?: string;
  /** First release that ships this format, while that release is not out yet. */
  since?: string;
}

export const allFormats: Format[] = [
  { name: 'Maven', key: 'maven', category: 'Languages', clients: ['Maven', 'Gradle'], logo: 'apachemaven' },
  { name: 'npm', key: 'npm', category: 'Languages', clients: ['npm', 'Yarn', 'pnpm', 'Bower'], logo: 'npm' },
  { name: 'PyPI', key: 'pypi', category: 'Languages', clients: ['pip', 'Poetry', 'pipenv', 'twine'], logo: 'pypi' },
  { name: 'NuGet', key: 'nuget', category: 'Languages', clients: ['dotnet', 'NuGet CLI', 'Chocolatey'], logo: 'nuget' },
  { name: 'Cargo', key: 'cargo', category: 'Languages', clients: ['cargo'], logo: 'rust' },
  { name: 'Go', key: 'go', category: 'Languages', clients: ['go mod'], logo: 'go' },
  { name: 'RubyGems', key: 'rubygems', category: 'Languages', clients: ['gem', 'Bundler'], logo: 'rubygems' },
  { name: 'Composer', key: 'composer', category: 'Languages', clients: ['Composer'], logo: 'composer' },
  { name: 'Hex', key: 'hex', category: 'Languages', clients: ['mix', 'rebar3'], logo: 'elixir' },
  { name: 'Pub', key: 'pub', category: 'Languages', clients: ['dart pub', 'flutter pub'], logo: 'dart' },
  { name: 'Swift', key: 'swift', category: 'Languages', clients: ['Swift Package Manager'], logo: 'swift' },
  { name: 'CocoaPods', key: 'cocoapods', category: 'Languages', clients: ['pod'], logo: 'cocoapods' },
  { name: 'CRAN', key: 'cran', category: 'Languages', clients: ['R', 'install.packages'], logo: 'r' },
  { name: 'SBT', key: 'sbt', category: 'Languages', clients: ['sbt', 'Ivy'], logo: 'scala' },
  { name: 'Conda', key: 'conda_native', category: 'Languages', clients: ['conda', 'mamba', 'micromamba'], logo: 'anaconda' },
  { name: 'Protobuf / BSR', key: 'protobuf', category: 'Schemas', clients: ['buf CLI'], logo: null, tile: 'proto' },
  { name: 'Docker / OCI', key: 'docker', category: 'Containers', clients: ['Docker', 'Podman', 'Buildx', 'ORAS'], logo: 'docker' },
  { name: 'Incus / LXC', key: 'incus', category: 'Containers', clients: ['incus', 'lxc'], logo: 'linuxcontainers' },
  { name: 'Helm', key: 'helm', category: 'Infrastructure', clients: ['helm'], logo: 'helm' },
  { name: 'Terraform', key: 'terraform', category: 'Infrastructure', clients: ['terraform', 'tofu'], logo: 'terraform' },
  { name: 'Vagrant', key: 'vagrant', category: 'Infrastructure', clients: ['vagrant'], logo: 'vagrant' },
  { name: 'Chef', key: 'chef', category: 'Infrastructure', clients: ['knife', 'Berkshelf'], logo: 'chef' },
  { name: 'Puppet', key: 'puppet', category: 'Infrastructure', clients: ['puppet module'], logo: 'puppet' },
  { name: 'Ansible', key: 'ansible', category: 'Infrastructure', clients: ['ansible-galaxy'], logo: 'ansible' },
  { name: 'Debian / APT', key: 'debian', category: 'System packages', clients: ['apt', 'dpkg'], logo: 'debian' },
  { name: 'RPM / YUM', key: 'rpm', category: 'System packages', clients: ['yum', 'dnf', 'zypper'], logo: 'redhat' },
  { name: 'Alpine / APK', key: 'alpine', category: 'System packages', clients: ['apk'], logo: 'alpinelinux' },
  { name: 'OPKG', key: 'opkg', category: 'System packages', clients: ['opkg (OpenWrt)'], logo: 'openwrt' },
  { name: 'Conan', key: 'conan', category: 'C / C++', clients: ['conan (v2)'], logo: 'conan' },
  { name: 'Bazel', key: 'bazel', category: 'C / C++', clients: ['bazel', 'bazelisk'], logo: 'bazel' },
  { name: 'Hugging Face', key: 'huggingface', category: 'ML / AI', clients: ['huggingface_hub', 'transformers'], logo: 'huggingface' },
  { name: 'ML Model', key: 'mlmodel', category: 'ML / AI', clients: ['Generic model storage'], logo: null, tile: 'ml' },
  { name: 'VS Code', key: 'vscode', category: 'Editor extensions', clients: ['VS Code', 'Cursor', 'Windsurf', 'Kiro'], logo: null, tile: 'vsix' },
  { name: 'JetBrains', key: 'jetbrains', category: 'Editor extensions', clients: ['IntelliJ', 'PyCharm', 'WebStorm'], logo: 'jetbrains' },
  { name: 'Agent Plugins', key: 'agentplugins', category: 'Editor extensions', clients: ['Claude Code', 'Cursor', 'Codex', 'GitHub Copilot'], logo: null, tile: 'agent', since: nextRelease },
  { name: 'Git LFS', key: 'gitlfs', category: 'Other', clients: ['git lfs'], logo: 'gitlfs' },
  { name: 'P2', key: 'p2', category: 'Other', clients: ['Eclipse IDE'], logo: 'eclipseide' },
  { name: 'Generic', key: 'generic', category: 'Other', clients: ['curl', 'wget', 'any HTTP client'], logo: null, tile: 'bin' },
];

if (allFormats.length !== 38) throw new Error(`expected 38 native formats, found ${allFormats.length}`);

/** The formats in the current release: what the landing pages count and show. */
export const formats: Format[] = allFormats.filter((f) => !f.since || isReleased(f.since));

/** Marquee rows: row 1 is languages and schemas, row 2 everything else. */
export const marqueeRows: Format[][] = [
  formats.filter((f) => f.category === 'Languages' || f.category === 'Schemas'),
  formats.filter((f) => f.category !== 'Languages' && f.category !== 'Schemas'),
];

/** Category chips, in the order the page shows them. */
const chipOrder: Category[] = [
  'Languages', 'Infrastructure', 'System packages', 'Containers', 'C / C++',
  'ML / AI', 'Editor extensions', 'Schemas', 'Other',
];
export const categories = chipOrder.map((name) => ({
  name,
  formats: formats.filter((f) => f.category === name),
}));

/** Number of client aliases on top of the native formats (docs: package-formats.mdx). */
export const clientAliases = 16;
