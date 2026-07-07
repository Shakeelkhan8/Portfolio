import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/admin/actions/auth";
import { Button } from "@/components/ui/button";

type AdminHeaderProps = {
  email: string;
};

export function AdminHeader({ email }: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
      <p className="text-sm text-muted-foreground">
        Signed in as <span className="font-medium text-foreground">{email}</span>
      </p>
      <form action={logoutAction}>
        <Button type="submit" variant="outline" size="sm">
          <LogOut className="size-4" data-icon="inline-start" />
          Sign out
        </Button>
      </form>
    </header>
  );
}
