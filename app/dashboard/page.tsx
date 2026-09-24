import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { UserProfile } from "@/components/auth/user-profile";
import { getAuthState } from "@/lib/auth/session";

export default async function DashboardPage() {
  const auth = await getAuthState();

  if (auth.status === "unauthenticated") {
    redirect("/login");
  }

  if (auth.status === "refresh-required") {
    redirect("/auth/refresh");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">Dashboard</h1>

        <p className="text-muted-foreground">Signed in as {auth.user.email}</p>

        <UserProfile />

        <LogoutButton />
      </div>
    </main>
  );
}
