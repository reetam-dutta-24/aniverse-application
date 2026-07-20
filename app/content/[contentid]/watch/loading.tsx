import { PageLoader } from "@/components/ui/page-loader";

export default function Loading() {
  return (
    <PageLoader
      label="Loading player…"
      variant="section"
      className="min-h-[40vh]"
    />
  );
}
