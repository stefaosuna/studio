import { Header } from "@/components/header";
import { VCardDashboard } from "@/components/vcard-dashboard";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<DashboardSkeleton />}>
           <VCardDashboard />
        </Suspense>
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-10 w-48 rounded-md bg-muted"></div>
          <div className="h-10 w-32 rounded-md bg-muted"></div>
        </div>
        <div className="mt-8 h-96 w-full rounded-lg border bg-card"></div>
      </div>
    </div>
  )
}
