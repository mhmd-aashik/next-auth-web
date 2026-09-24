import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refresh_token")?.value;

  const accessToken = cookieStore.get("access_token")?.value;

  try {
    if (refreshToken) {
      const nestResponse = await fetch(
        `${process.env.NEST_API_URL}/auth/logout`,
        {
          method: "POST",

          headers: {
            Cookie: `refresh_token=${refreshToken}`,

            ...(accessToken && {
              Authorization: `Bearer ${accessToken}`,
            }),
          },

          cache: "no-store",
        },
      );

      console.log("Nest logout status:", nestResponse.status);
    }
  } catch (error) {
    console.error("Nest logout request failed:", error);
  }

  // Always clear browser authentication state.
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  return NextResponse.json({
    success: true,
  });
}
