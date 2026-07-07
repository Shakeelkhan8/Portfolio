import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/layout/admin-shell";
import { getAdminSession } from "@/lib/admin/actions/auth";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
