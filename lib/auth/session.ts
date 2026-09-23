import "server-only";

import { cookies } from "next/headers";

export async function hasSession(): Promise<boolean> {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refresh_token")?.value;

  return Boolean(refreshToken);
}
