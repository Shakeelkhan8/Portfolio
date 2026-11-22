import { siWhatsapp } from "simple-icons";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  UpworkIcon,
} from "@/components/shared/brand-icons";
import type { NavigationData } from "@/types/cms";

type IconComponent = (props: { className?: string }) => React.ReactNode;

/** Admin social links are free text; ones without an icon here are skipped. */
const ICONS: Record<string, IconComponent | undefined> = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  Upwork: UpworkIcon,
  Email: MailIcon,
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={siWhatsapp.path} />
    </svg>
  );
}

type SocialRailProps = {
  navigation: NavigationData;
  /** Server-derived wa.me link, or null; the phone number itself is never passed. */
  whatsappHref?: string | null;
};

/**
 * A fixed vertical pill of profile links on the left edge, like the
 * benchmark portfolio. Shown from 1024px (laptops); phones and tablets have
 * the bottom tab bar instead. The rail ends 72px from the edge, so between
 * 1024px and 1240px, where the content's own margin is narrower than that,
 * SiteShell pads the page by RAIL_CLEARANCE (2026-11-22; it was 1320px+
 * only and hidden on the user's laptop). Links come from Admin → Social
 * links, plus WhatsApp when a number is set.
 */
/**
 * Page padding while the rail overlaps the content's margin (1024–1239px).
 * One class with both bounds: as "lg:pl-14 min-[1240px]:pl-0", Tailwind
 * emitted the arbitrary min-[1240px] rule before lg, so lg always won.
 */
export const RAIL_CLEARANCE = "lg:max-[1240px]:pl-14";

export function SocialRail({ navigation, whatsappHref = null }: SocialRailProps) {
  const links = [
    ...navigation.socialNav.map((item) => ({
      title: item.title,
      href: item.href,
      Icon: ICONS[item.title],
    })),
    ...(whatsappHref ? [{ title: "WhatsApp", href: whatsappHref, Icon: WhatsAppIcon }] : []),
  ].flatMap((link) => (link.Icon && link.href ? [{ ...link, Icon: link.Icon }] : []));

  if (links.length === 0) return null;

  return (
    <nav
      aria-label="Profiles"
      className="fixed top-1/2 left-5 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col items-center gap-1 rounded-full bg-foreground/90 px-1.5 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_12px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur">
        {links.map(({ title, href, Icon }) => {
          const newTab = href.startsWith("http");
          return (
            <li key={title}>
              <a
                href={href}
                {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-label={newTab ? `${title} (opens in a new tab)` : title}
                title={title}
                className="flex size-10 items-center justify-center rounded-full text-background/80 transition-[color,transform,background-color] duration-200 hover:scale-110 hover:bg-background/10 hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                <Icon className="size-[18px]" />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
