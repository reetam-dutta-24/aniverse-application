import { ContentTopbar } from "@/components/content/content-topbar";
import { getOptionalTopbarUser } from "@/lib/data/user";

export interface AppContentLayoutProps {
  children: React.ReactNode;
  /** Extra classes on `<main>` (e.g. search page padding). */
  mainClassName?: string;
}

/** Shared shell for all public content routes — consistent topbar + main. */
export async function AppContentLayout({
  children,
  mainClassName = "w-full pb-16",
}: AppContentLayoutProps) {
  const user = await getOptionalTopbarUser();

  return (
    <div className="min-h-dvh bg-background">
      <ContentTopbar user={user} />
      <main className={mainClassName}>{children}</main>
    </div>
  );
}
