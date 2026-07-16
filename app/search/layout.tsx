import { AppContentLayout } from "@/components/layout/app-content-layout";

export default async function SearchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppContentLayout mainClassName="w-full px-4 pb-16 pt-6 sm:px-8 lg:px-12">
      {children}
    </AppContentLayout>
  );
}
