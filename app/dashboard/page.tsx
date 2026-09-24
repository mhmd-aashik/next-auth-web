import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { UserProfile } from "@/components/auth/user-profile";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">Dashboard</h1>

        <UserProfile />

        <LogoutButton />
      </div>
    </main>
  );
}
