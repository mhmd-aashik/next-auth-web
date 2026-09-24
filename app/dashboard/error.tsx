"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <div>
          <h1 className="text-2xl font-semibold">Something went wrong</h1>

          <p className="text-muted-foreground mt-2 text-sm">
            We couldn&apos;t load your dashboard.
          </p>
        </div>

        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </main>
  );
}
