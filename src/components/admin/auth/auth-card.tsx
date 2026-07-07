import { cn } from "@/lib/utils";

type AuthCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-sm",
        className,
      )}
    >
      <div className="mb-8 space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Portfolio CMS
        </p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
      {footer ? <div className="mt-6 text-center text-sm">{footer}</div> : null}
    </div>
  );
}
