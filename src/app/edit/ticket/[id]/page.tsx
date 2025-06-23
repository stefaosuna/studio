import { Header } from "@/components/header";
import { TicketEditor } from "@/components/ticket-editor";

export default function EditTicketPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <TicketEditor ticketId={params.id} />
      </main>
    </div>
  );
}
