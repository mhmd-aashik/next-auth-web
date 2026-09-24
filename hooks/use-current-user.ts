"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api/api-fetch";
import type { User } from "@/lib/api/auth";

async function getCurrentUser(): Promise<User> {
  const response = await apiFetch("/api/auth/me");

  if (!response.ok) {
    throw new Error("Unable to get current user");
  }

  return response.json() as Promise<User>;
}

export function useCurrentUser() {
  return useQuery({
    // Query key
    queryKey: ["current-user"],
    // Get the current user
    queryFn: getCurrentUser,
    // Cache the data for 30 seconds
    staleTime: 30_000,
  });
}
