import { DashboardLayout } from "@/components/dashboard-layout";
import { MetricsDashboard } from "@/components/metrics-dashboard";
import { Suspense } from "react";

export default function MetricsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsDashboard />
      </Suspense>
    </DashboardLayout>
  );
}

function MetricsSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
       <div className="animate-pulse space-y-8">
         <div className="h-8 w-48 rounded-md bg-muted"></div>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="h-28 rounded-lg bg-card"></div>
            <div className="h-28 rounded-lg bg-card"></div>
            <div className="h-28 rounded-lg bg-card"></div>
            <div className="h-28 rounded-lg bg-card"></div>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 rounded-lg bg-card"></div>
            <div className="h-96 rounded-lg bg-card"></div>
         </div>
       </div>
    </div>
  )
}
