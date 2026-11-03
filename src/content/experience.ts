import type { ExperienceEntry, Education, Accomplishment } from "@/types";

export const experience: ExperienceEntry[] = [
  {
    id: "elityx",
    role: "Full Stack Developer (backend focus)",
    company: "Elityx",
    location: "Islamabad, Pakistan",
    startDate: "2025-11",
    endDate: null,
    featured: true,
    highlights: [
      "Primary engineer for the first seven months on a live multi-tenant dispatch and settlement platform for logistics companies in Saudi Arabia.",
      "Designed and built the financial engine: a double-entry ledger, invoicing, reconciliation and card payments through EdfaPay.",
      "Added the payments test gate that runs before every production deploy, so a broken money path can't ship.",
      "Built the tenant-isolation layer that keeps each client company's data separate.",
      "Designed the inbound integration framework that client integrations plug into, and work on the WASL government integration.",
      "Built the first versions of the dispatch engine and two of the platform's service lines.",
    ],
  },
  {
    id: "independent",
    role: "Independent Developer",
    company: "Self-employed",
    location: "Remote",
    startDate: "2023-01",
    endDate: null,
    highlights: [
      "Laravel project work alongside full-time roles: payment integrations, AI features, upgrades, store sync and bug fixes.",
      "Built a billing and subscriber system for three local internet service providers in 2023: billing, subscription plans, usage tracking and a customer portal.",
      "Built websites for small businesses, including a multi-branch martial arts academy with class timetables, fees per branch and an enrolment form.",
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
    text: "Designed the financial engine of a live multi-tenant logistics SaaS: double-entry ledger, invoicing, reconciliation and card payments.",
  },
  {
    text: "Reduced frontend development time by 30% at iProfessional with a reusable 20+ block component library.",
  },
  {
    text: "Added a payments test gate that blocks any production deploy when the payment tests fail.",
  },
];

export const resumeSummary =
  "Laravel backend developer, building for the web since 2021 and full-time with PHP and Laravel since 2022. I build the parts that handle money and data: payment gateways and webhooks, ledgers, tenant isolation, APIs, integrations and AI features. Currently a full stack developer (backend focus) at Elityx on a logistics SaaS for the Saudi market.";
