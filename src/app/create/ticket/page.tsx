import { DashboardLayout } from "@/components/dashboard-layout";
import { TicketEditor } from "@/components/ticket-editor";
import { Suspense } from "react";

function Loading() {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    )
}

export default function CreateTicketPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<Loading />}>
        <TicketEditor />
      </Suspense>
    </DashboardLayout>
  );
}
