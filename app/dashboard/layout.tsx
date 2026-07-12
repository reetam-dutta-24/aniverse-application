import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentUser } from "@/lib/data/user";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return <DashboardShell userName={user.name}>{children}</DashboardShell>;
}
