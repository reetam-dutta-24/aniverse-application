import { AppContentLayout } from "@/components/layout/app-content-layout";

export default async function SongLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppContentLayout>{children}</AppContentLayout>;
}
