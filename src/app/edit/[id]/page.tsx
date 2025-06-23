import { Header } from "@/components/header";
import { VCardEditor } from "@/components/vcard-editor";

export default function EditVCardPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <VCardEditor vcardId={params.id} />
      </main>
    </div>
  );
}
