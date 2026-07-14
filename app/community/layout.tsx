import { ContentTopbar } from "@/components/content/content-topbar";
import { getOptionalUser } from "@/lib/data/user";

export default async function CommunityLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getOptionalUser();

  return (
    <div className="min-h-dvh bg-background">
      <ContentTopbar userName={user?.name ?? "Guest"} />
      <main className="w-full pb-16">{children}</main>
    </div>
  );
}
