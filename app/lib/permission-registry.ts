export const ACCESS_LEVELS = ["none", "view", "manage", "approve"] as const;

export type AccessLevel = (typeof ACCESS_LEVELS)[number];

export interface PermissionFeature {
  key: string;
  group: string;
  label: string;
  description: string;
  levels: AccessLevel[];
}

export const permissionFeatures: PermissionFeature[] = [
  {
    key: "master.company",
    group: "Master Data",
    label: "Company",
    description: "Companies, customers, vendors, and addresses",
    levels: ["none", "view", "manage"],
  },
  {
    key: "master.service",
    group: "Master Data",
    label: "Service",
    description: "Services, categories, and units",
    levels: ["none", "view", "manage"],
  },
  {
    key: "master.logistics",
    group: "Master Data",
    label: "Logistics Master",
    description: "Ports, vessels, planes, packages, movements, and BL clauses",
    levels: ["none", "view", "manage"],
  },
  {
    key: "master.finance",
    group: "Master Data",
    label: "Finance Master",
    description: "Bank accounts, tax, expense categories, and finance references",
    levels: ["none", "view", "manage"],
  },
  {
    key: "operational.job",
    group: "Operational",
    label: "Job",
    description: "Operational jobs and closing workflow",
    levels: ["none", "view", "manage", "approve"],
  },
  {
    key: "operational.quotation",
    group: "Operational",
    label: "Quotation",
    description: "Quotation and pricing workflow",
    levels: ["none", "view", "manage", "approve"],
  },
  {
    key: "operational.ebl",
    group: "Operational",
    label: "eBL",
    description: "Electronic bill of lading drafts and approvals",
    levels: ["none", "view", "manage", "approve"],
  },
  {
    key: "finance.invoice",
    group: "Finance",
    label: "Invoice",
    description: "Customer invoices and posting",
    levels: ["none", "view", "manage", "approve"],
  },
  {
    key: "finance.payment",
    group: "Finance",
    label: "Payment",
    description: "Payments and finance transactions",
    levels: ["none", "view", "manage", "approve"],
  },
  {
    key: "finance.accounting",
    group: "Finance",
    label: "Accounting",
    description: "Chart of accounts, journal, and mappings",
    levels: ["none", "view", "manage", "approve"],
  },
  {
    key: "finance.report",
    group: "Finance",
    label: "Finance Report",
    description: "Finance dashboard and reports",
    levels: ["none", "view"],
  },
  {
    key: "settings.user",
    group: "Settings",
    label: "Users",
    description: "User account management",
    levels: ["none", "view", "manage"],
  },
  {
    key: "settings.role",
    group: "Settings",
    label: "Roles",
    description: "Role and permission management",
    levels: ["none", "view", "manage"],
  },
  {
    key: "settings.tenant",
    group: "Settings",
    label: "Tenant",
    description: "Tenant and organization settings",
    levels: ["none", "view", "manage"],
  },
  {
    key: "settings.activityLog",
    group: "Settings",
    label: "Activity Log",
    description: "Audit and activity log visibility",
    levels: ["none", "view"],
  },
];

export const accessLevelRank: Record<AccessLevel, number> = {
  none: 0,
  view: 1,
  manage: 2,
  approve: 3,
};

export const featureGroups = permissionFeatures.reduce(
  (groups, feature) => {
    if (!groups[feature.group]) {
      groups[feature.group] = [];
    }
    groups[feature.group]!.push(feature);
    return groups;
  },
  {} as Record<string, PermissionFeature[]>,
);

export function isAccessLevel(value: unknown): value is AccessLevel {
  return typeof value === "string" && ACCESS_LEVELS.includes(value as AccessLevel);
}

export function normalizeAccessLevel(value: unknown): AccessLevel {
  return isAccessLevel(value) ? value : "none";
}

export function hasAccessLevel(actual: AccessLevel, required: AccessLevel) {
  return accessLevelRank[actual] >= accessLevelRank[required];
}
