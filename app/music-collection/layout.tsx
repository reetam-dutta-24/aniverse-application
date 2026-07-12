import { getCurrentUser } from "@/lib/data/user";
import { ContentTopbar } from "@/components/content/content-topbar";

export default async function MusicCollectionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-dvh bg-background">
      <ContentTopbar userName={user.name} />
      <main className="w-full pb-16">{children}</main>
    </div>
  );
}
