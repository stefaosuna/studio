import { DashboardLayout } from "@/components/dashboard-layout";
import { EventEditor } from "@/components/event-editor";

export default function CreateEventPage() {
  return (
    <DashboardLayout>
      <EventEditor />
    </DashboardLayout>
  );
}
