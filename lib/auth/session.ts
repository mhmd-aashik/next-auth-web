import "server-only";

import { cookies } from "next/headers";

export interface CurrentUser {
  id: string;
  email: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  const response = await fetch(`${process.env.NEST_API_URL}/auth/me`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${accessToken}`,
    },

    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as CurrentUser;
}
