import { DashboardLayout } from "@/components/dashboard-layout";
import { TicketEditor } from "@/components/ticket-editor";

export default function CreateTicketPage() {
  return (
    <DashboardLayout>
      <TicketEditor />
    </DashboardLayout>
  );
}
