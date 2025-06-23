import { Header } from "@/components/header";
import { VCardEditor } from "@/components/vcard-editor";

export default function CreateVCardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <VCardEditor />
      </main>
    </div>
  );
}
