import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  Briefcase,
  FileText,
  FolderKanban,
  GraduationCap,
  Image,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  Settings,
  Sparkles,
  Wrench,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Projects", href: "/admin/projects", icon: FolderKanban },
      { title: "Blog", href: "/admin/blog", icon: BookOpen },
      { title: "Pages", href: "/admin/pages", icon: FileText },
      { title: "Skills", href: "/admin/skills", icon: Sparkles },
      { title: "Experience", href: "/admin/experience", icon: Briefcase },
      { title: "Education", href: "/admin/education", icon: GraduationCap },
      {
        title: "Certifications",
        href: "/admin/certifications",
        icon: Award,
      },
      {
        title: "Testimonials",
        href: "/admin/testimonials",
        icon: MessageSquareQuote,
      },
      { title: "Services", href: "/admin/services", icon: Wrench },
    ],
  },
  {
    label: "Assets & inbox",
    items: [
      { title: "Media", href: "/admin/media", icon: Image },
      { title: "Resume", href: "/admin/resume", icon: FileText },
      { title: "Contact", href: "/admin/contact", icon: Mail },
    ],
  },
  {
    label: "Configuration",
    items: [
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export const adminPublicRoutes = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
] as const;
