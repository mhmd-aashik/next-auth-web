import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Signed in as {user.email}</p>
        <LogoutButton />
      </div>
    </main>
  );
}
