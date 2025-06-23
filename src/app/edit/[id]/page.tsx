import { DashboardLayout } from "@/components/dashboard-layout";
import { VCardEditor } from "@/components/vcard-editor";

export default function EditVCardPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <VCardEditor vcardId={params.id} />
    </DashboardLayout>
  );
}
