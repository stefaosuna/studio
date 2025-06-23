import { DashboardLayout } from "@/components/dashboard-layout";
import { TicketEditor } from "@/components/ticket-editor";

export default function EditTicketPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <TicketEditor ticketId={params.id} />
    </DashboardLayout>
  );
}
