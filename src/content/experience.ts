import type { ExperienceEntry, Education, Accomplishment } from "@/types";

export const experience: ExperienceEntry[] = [
  {
    id: "elityx",
    role: "Senior Backend Engineer",
    company: "Elityx",
    location: "Islamabad, Pakistan",
    startDate: "2025-11",
    endDate: null,
    featured: true,
    highlights: [
      "Primary backend engineer on a live multi-tenant dispatch platform for logistics companies in Saudi Arabia, owning 80%+ of the backend across 5 companies, 200+ captains and 500+ shipments a day.",
      "Designed zone-based batch trip creation with clustering, rule-based auto-dispatch, and a captain control panel with live map tracking.",
      "Built a three-layer financial system on a double-entry ledger: company billing, inter-company settlements and captain payouts, with HyperPay and EdfaPay processing real transactions.",
      "Work across the platform's integrations: Salla, Zid and Shopify webhooks through an adapter layer, WASL, and ZATCA e-invoicing. Built and maintain all mobile APIs.",
      "Built the operations portal (Laravel Blade, Vue.js) with dashboards and a near-real-time shipment feed.",
      "Own the PostgreSQL schema and migrations, indexing for sub-second API responses, and Docker-based deployment.",
    ],
  },
  {
    id: "hum-network",
    role: "Backend Developer",
    company: "Hum Network Limited",
    location: "Islamabad, Pakistan",
    startDate: "2023-09",
    endDate: "2025-10",
    highlights: [
      "Automated a manual Excel reporting process, cutting processing time from 3 days to under 2 minutes and saving 100+ operational hours monthly.",
      "Developed enterprise backend APIs and database architecture for seamless JSON integration with Ross XPression to automate live TV data workflows.",
      "Integrated WebSockets and Socket.IO for real-time data synchronisation across internal applications.",
      "Implemented RBAC access control and secure authentication flows for sensitive organisational data.",
    ],
  },
  {
    id: "iprofessional",
    role: "Web Developer",
    company: "iProfessional Inc.",
    location: "Rawalpindi, Pakistan",
    startDate: "2022-10",
    endDate: "2023-08",
    highlights: [
      "Built custom CRM modules in Laravel to manage client interactions, automate follow-ups, and improve lead conversion tracking.",
      "Delivered a component library of 20+ reusable Elementor blocks for WordPress, reducing frontend development time by 30%.",
      "Customised and maintained e-commerce sites with WooCommerce, integrating payment gateways and streamlining checkout flows.",
    ],
  },
  {
    id: "hum-intern",
    role: "Web Developer (Internship)",
    company: "Hum Network Limited",
    location: "Islamabad, Pakistan",
    startDate: "2022-07",
    endDate: "2022-09",
    highlights: [
      "Built and maintained website content using HTML, CSS, and WordPress; customised themes using PHP.",
    ],
  },
  {
    id: "genesis",
    role: "Frontend Developer (Internship)",
    company: "Genesis Engineering",
    location: "Rawalpindi, Pakistan",
    startDate: "2021-01",
    endDate: "2021-06",
    highlights: [
      "Gained foundational experience in frontend development using HTML, CSS, Bootstrap, and Git.",
    ],
  },
];

export const education: Education = {
  degree: "BSc Software Engineering",
  institution: "SZABIST University",
  location: "Islamabad, Pakistan",
  startDate: "2019-11",
  endDate: "2024-02",
};

export const accomplishments: Accomplishment[] = [
  {
    text: "Reduced a 3-day manual reporting process to under 2 minutes, saving 100+ operational hours per month at Hum Network.",
  },
  {
    text: "Primary backend engineer on a live multi-tenant dispatch platform, taking 5 companies from zero to production.",
  },
  {
    text: "Reduced frontend development time by 30% at iProfessional with a reusable 20+ block component library.",
  },
  {
    text: "Built and deployed a full-stack ISP management system used daily by 3 internet service providers.",
  },
];

export const resumeSummary =
  "Senior backend engineer with 4+ years of full-time experience in PHP, Laravel and PostgreSQL, building multi-tenant SaaS, payment flows and enterprise automation. Currently the primary backend engineer on a live logistics platform for the Saudi market.";
