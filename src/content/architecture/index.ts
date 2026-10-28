import type { ArchitectureDiagramData } from "@/types";

export const architectureDiagrams: Record<string, ArchitectureDiagramData> = {
  "dispatch-management-saas": {
    title: "Dispatch Management SaaS: system architecture",
    nodes: [
      { id: "portal", label: "Admin Portal", type: "frontend", layer: 0 },
      { id: "mobile", label: "Mobile Apps", type: "frontend", layer: 0 },
      { id: "api", label: "Laravel API", type: "api", layer: 1 },
      { id: "dispatch", label: "Auto-Dispatch", type: "service", layer: 2 },
      { id: "financial", label: "Financial System", type: "service", layer: 2 },
      {
        id: "integrations",
        label: "Integration Layer",
        type: "service",
        layer: 2,
      },
      { id: "postgres", label: "PostgreSQL", type: "database", layer: 3 },
      { id: "redis", label: "Redis Cache", type: "cache", layer: 3 },
      { id: "cron", label: "Scheduled Jobs", type: "queue", layer: 3 },
      {
        id: "stores",
        label: "Salla · Zid · Shopify",
        type: "external",
        layer: 4,
      },
      { id: "gov", label: "WASL · ZATCA", type: "external", layer: 4 },
      {
        id: "payments",
        label: "HyperPay · EdfaPay",
        type: "external",
        layer: 4,
      },
    ],
    edges: [
      { from: "portal", to: "api" },
      { from: "mobile", to: "api" },
      { from: "api", to: "dispatch" },
      { from: "api", to: "financial" },
      { from: "api", to: "integrations" },
      { from: "dispatch", to: "postgres" },
      { from: "dispatch", to: "cron" },
      { from: "financial", to: "postgres" },
      { from: "financial", to: "payments" },
      { from: "integrations", to: "postgres" },
      { from: "integrations", to: "stores" },
      { from: "integrations", to: "gov" },
      { from: "api", to: "redis" },
    ],
  },
  "isp-management-system": {
    title: "ISP Management System: Architecture",
    nodes: [
      { id: "admin", label: "Admin Dashboard", type: "frontend", layer: 0 },
      { id: "portal", label: "Customer Portal", type: "frontend", layer: 0 },
      { id: "app", label: "Laravel App", type: "api", layer: 1 },
      { id: "billing", label: "Billing Engine", type: "service", layer: 2 },
      { id: "rbac", label: "RBAC & Auth", type: "service", layer: 2 },
      { id: "mysql", label: "MySQL", type: "database", layer: 3 },
      { id: "payments", label: "Payment Gateway", type: "external", layer: 4 },
    ],
    edges: [
      { from: "admin", to: "app" },
      { from: "portal", to: "app" },
      { from: "app", to: "billing" },
      { from: "app", to: "rbac" },
      { from: "billing", to: "mysql" },
      { from: "rbac", to: "mysql" },
      { from: "billing", to: "payments" },
    ],
  },
  "enterprise-reporting-automation": {
    title: "Reporting Automation: Architecture",
    nodes: [
      { id: "internal", label: "Internal Apps", type: "frontend", layer: 0 },
      { id: "api", label: "Laravel API", type: "api", layer: 1 },
      { id: "reports", label: "Report Generator", type: "service", layer: 2 },
      { id: "websocket", label: "WebSocket Server", type: "service", layer: 2 },
      { id: "db", label: "MySQL", type: "database", layer: 3 },
      { id: "ross", label: "Ross XPression", type: "external", layer: 4 },
    ],
    edges: [
      { from: "internal", to: "api" },
      { from: "api", to: "reports" },
      { from: "api", to: "websocket" },
      { from: "reports", to: "db" },
      { from: "reports", to: "ross" },
      { from: "websocket", to: "internal" },
    ],
  },
};

export function getArchitectureDiagram(
  slug: string,
): ArchitectureDiagramData | undefined {
  return architectureDiagrams[slug];
}
