import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { getMailtoHref, getPublicEmailLabel } from "@/lib/contact/email-display";

type ContactCardsProps = {
  email: string;
  linkedin: string;
  /** Server-derived wa.me link (src/lib/contact/whatsapp.ts), or null. */
  whatsappHref: string | null;
  /** "row": three across from sm (default); "stack": one per row. */
  layout?: "row" | "stack";
};

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

/**
 * Direct contact routes as three cards (email, LinkedIn, WhatsApp), each a
 * single link. Cards without data are left out, so the row never shows an
 * empty card.
 */
export function ContactCards({
  email,
  linkedin,
  whatsappHref,
  layout = "row",
}: ContactCardsProps) {
  const cards = [
    email
      ? {
          key: "email",
          label: "Email",
          value: getPublicEmailLabel(email, { preferAddress: true }),
          href: getMailtoHref(email),
          external: false,
          icon: <Mail className="size-5" aria-hidden="true" />,
        }
      : null,
    linkedin
      ? {
          key: "linkedin",
          label: "LinkedIn",
          value: "Connect on LinkedIn",
          href: linkedin,
          external: true,
          icon: <LinkedInIcon className="size-5" />,
        }
      : null,
    whatsappHref
      ? {
          key: "whatsapp",
          label: "WhatsApp",
          value: "Message on WhatsApp",
          href: whatsappHref,
          external: true,
          icon: <MessageCircle className="size-5" aria-hidden="true" />,
        }
      : null,
  ].filter((card): card is NonNullable<typeof card> => card !== null);

  if (cards.length === 0) return null;

  return (
    <ul
      aria-label="Contact details"
      className={layout === "stack" ? "grid gap-3" : "grid gap-4 sm:grid-cols-3"}
    >
      {cards.map((card) => (
        <li key={card.key}>
          <a
            href={card.href}
            {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex h-full items-start gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5 transition-colors duration-300 hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-foreground/10 text-foreground/80">
              {card.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="label-mono block text-foreground/55">{card.label}</span>
              <span className="mt-1.5 block truncate text-[0.9375rem] font-medium text-foreground">
                {card.value}
              </span>
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-foreground/50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
            {card.external ? <span className="sr-only">(opens in a new tab)</span> : null}
          </a>
        </li>
      ))}
    </ul>
  );
}
