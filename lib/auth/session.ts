import "server-only";

import { cookies } from "next/headers";

export interface CurrentUser {
  id: string;
  email: string;
}

export type AuthResult =
  | {
      status: "authenticated";
      user: CurrentUser;
    }
  | {
      status: "refresh-required";
    }
  | {
      status: "unauthenticated";
    };

export async function getAuthState(): Promise<AuthResult> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken) {
    return refreshToken
      ? { status: "refresh-required" }
      : { status: "unauthenticated" };
  }

  const response = await fetch(`${process.env.NEST_API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (response.ok) {
    const user = (await response.json()) as CurrentUser;

    return {
      status: "authenticated",
      user,
    };
  }

  if (response.status === 401 && refreshToken) {
    return {
      status: "refresh-required",
    };
  }

  return {
    status: "unauthenticated",
  };
}
