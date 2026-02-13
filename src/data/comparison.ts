export type CellValue = boolean | string;

export interface ComparisonRow {
  feature: string;
  artifactKeeper: CellValue;
  artifactoryPro: CellValue;
  artifactoryEnterprise: CellValue;
}

export interface ComparisonColumn {
  key: keyof Omit<ComparisonRow, "feature">;
  label: string;
}

export const columns: ComparisonColumn[] = [
  { key: "artifactKeeper", label: "Artifact Keeper" },
  { key: "artifactoryPro", label: "Artifactory Pro (~$400/mo)" },
  { key: "artifactoryEnterprise", label: "Artifactory Enterprise (~$1,400/mo+)" },
];

export const rows: ComparisonRow[] = [
  {
    feature: "All package formats (45+)",
    artifactKeeper: true,
    artifactoryPro: true,
    artifactoryEnterprise: true,
  },
  {
    feature: "Proxy & virtual repositories",
    artifactKeeper: true,
    artifactoryPro: true,
    artifactoryEnterprise: true,
  },
  {
    feature: "Security scanning",
    artifactKeeper: true,
    artifactoryPro: false,
    artifactoryEnterprise: true,
  },
  {
    feature: "Artifact signing",
    artifactKeeper: true,
    artifactoryPro: false,
    artifactoryEnterprise: true,
  },
  {
    feature: "SBOM generation",
    artifactKeeper: true,
    artifactoryPro: false,
    artifactoryEnterprise: true,
  },
  {
    feature: "High availability",
    artifactKeeper: true,
    artifactoryPro: false,
    artifactoryEnterprise: true,
  },
  {
    feature: "Peer-to-peer replication",
    artifactKeeper: true,
    artifactoryPro: false,
    artifactoryEnterprise: true,
  },
  {
    feature: "OpenTelemetry & Prometheus",
    artifactKeeper: true,
    artifactoryPro: false,
    artifactoryEnterprise: true,
  },
  {
    feature: "LDAP/SAML/OIDC",
    artifactKeeper: true,
    artifactoryPro: true,
    artifactoryEnterprise: true,
  },
  {
    feature: "REST API & gRPC",
    artifactKeeper: true,
    artifactoryPro: "REST only",
    artifactoryEnterprise: "REST only",
  },
  {
    feature: "Migration tooling",
    artifactKeeper: true,
    artifactoryPro: false,
    artifactoryEnterprise: false,
  },
  {
    feature: "Self-hosted",
    artifactKeeper: true,
    artifactoryPro: true,
    artifactoryEnterprise: true,
  },
  {
    feature: "Price",
    artifactKeeper: "$0",
    artifactoryPro: "~$400/month",
    artifactoryEnterprise: "~$1,400/month+",
  },
];
