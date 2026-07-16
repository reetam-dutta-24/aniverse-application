import { Suspense } from "react";
import { DashboardMessagesPanel } from "@/components/dashboard/dashboard-messages-panel";

export default function DashboardMessagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="mt-1 text-sm text-white/70">
          Direct messages with your friends. Messages from non-friends arrive with a warning.
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-white/60">Loading messages…</p>}>
        <DashboardMessagesPanel />
      </Suspense>
    </div>
  );
}
