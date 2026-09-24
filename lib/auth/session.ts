import "server-only";

import { cookies } from "next/headers";

export interface CurrentUser {
  id: string;
  email: string;
}

interface RefreshResponse {
  accessToken: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return null;
  }

  // 1. Exchange refresh token for an access token
  const refreshResponse = await fetch(
    `${process.env.NEST_API_URL}/auth/refresh`,
    {
      method: "POST",

      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },

      cache: "no-store",
    },
  );

  if (!refreshResponse.ok) {
    return null;
  }

  const refreshData = (await refreshResponse.json()) as RefreshResponse;

  // 2. Use access token to ask NestJS who the user is
  const meResponse = await fetch(`${process.env.NEST_API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${refreshData.accessToken}`,
    },

    cache: "no-store",
  });

  if (!meResponse.ok) {
    return null;
  }

  return (await meResponse.json()) as CurrentUser;
}
