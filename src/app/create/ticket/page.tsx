import { Header } from "@/components/header";
import { TicketEditor } from "@/components/ticket-editor";

export default function CreateTicketPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <TicketEditor />
      </main>
    </div>
  );
}
