import { DashboardLayout } from "@/components/dashboard-layout";
import { MemberEditor } from "@/components/member-editor";

export default function EditMemberPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <MemberEditor memberId={params.id} />
    </DashboardLayout>
  );
}
