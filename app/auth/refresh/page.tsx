"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RefreshSessionPage() {
  const router = useRouter();

  useEffect(() => {
    async function refreshSession() {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        router.replace("/login");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    }

    void refreshSession();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Restoring your session...</p>
    </main>
  );
}
