import type { ExperienceEntry, Education, Accomplishment } from "@/types";

export const experience: ExperienceEntry[] = [
  {
    id: "elityx",
    role: "Backend Engineer",
    company: "Elityx",
    location: "Islamabad, Pakistan",
    startDate: "2025-11",
    endDate: null,
    featured: true,
    highlights: [
      "Sole backend engineer on a live multi-tenant Dispatch Management SaaS, owning 80%+ of the system end-to-end across 5 onboarded companies, 200+ captains, and 500+ daily shipments.",
      "Architected zone-based batch trip creation with clustering, intelligent auto-dispatch, and a real-time captain control panel with live map tracking.",
      "Built a three-layer financial system: company billing, inter-company settlements, and captain-side financials with payment gateway integration processing real transactions.",
      "Built an adapter-based integration layer connecting e-commerce platforms (Shopify, Salla, and others) via webhooks; built and maintain all mobile APIs.",
      "Delivered portal frontend (Laravel Blade, Vue.js) with operational dashboards and near-real-time shipment lifecycle feeds.",
      "Own PostgreSQL schema design and migrations; maintain production systems with indexing for sub-second response times and Docker-based deployment.",
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
    text: "Sole backend engineer on a live multi-tenant Dispatch SaaS, onboarding 5 companies from zero to production.",
  },
  {
    text: "Reduced frontend development time by 30% at iProfessional with a reusable 20+ block component library.",
  },
  {
    text: "Built and deployed a full-stack ISP Management System still actively used by 3 internet service providers.",
  },
];

export const resumeSummary =
  "Backend Engineer with 5+ years of experience building production-grade SaaS platforms, enterprise automation systems, and API-driven architectures. Proven ability to reduce operational workload through automation and design systems that scale with business growth.";
