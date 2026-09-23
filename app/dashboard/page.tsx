import { redirect } from "next/navigation";

import { hasSession } from "@/lib/auth/session";

export default async function DashboardPage() {
  const authenticated = await hasSession();

  if (!authenticated) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Dashboard</h1>

        <p className="text-muted-foreground">You are signed in.</p>
      </div>
    </main>
  );
}
