import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/shared/brand-icons";
import { socialNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { AppLink } from "@/components/shared/app-link";

const iconMap = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  Email: MailIcon,
} as const;

type SocialLinksProps = {
  className?: string;
  iconSize?: "sm" | "md";
};

export function SocialLinks({ className, iconSize = "md" }: SocialLinksProps) {
  const sizeClass = iconSize === "sm" ? "size-4" : "size-5";

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {socialNav.map((item) => {
        const IconComponent = iconMap[item.title as keyof typeof iconMap];

        return (
          <AppLink
            key={item.href}
            href={item.href}
            external
            showExternalIcon={false}
            aria-label={item.title}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {IconComponent ? (
              <IconComponent className={sizeClass} />
            ) : (
              item.title
            )}
          </AppLink>
        );
      })}
    </div>
  );
}
