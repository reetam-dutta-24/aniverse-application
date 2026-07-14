import { getOptionalUser } from "@/lib/data/user";
import { ContentTopbar } from "@/components/content/content-topbar";

export default async function ContentLayout({
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
