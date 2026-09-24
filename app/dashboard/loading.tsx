export default function DashboardLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-3">
        <div className="bg-muted h-8 w-48 animate-pulse rounded-md" />
        <div className="bg-muted h-4 w-64 animate-pulse rounded-md" />
        <div className="bg-muted h-9 w-24 animate-pulse rounded-md" />
      </div>
    </main>
  );
}
