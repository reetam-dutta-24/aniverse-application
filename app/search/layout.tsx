import { ContentTopbar } from "@/components/content/content-topbar";
import { getCurrentUser } from "@/lib/data/user";

export default async function SearchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-dvh bg-background">
      <ContentTopbar userName={user.name} />
      <main className="w-full px-4 pb-16 pt-6 sm:px-8 lg:px-12">{children}</main>
    </div>
  );
}
