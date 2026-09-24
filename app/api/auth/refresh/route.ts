import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RefreshResponse {
  accessToken: string;
}

export async function POST() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const nestResponse = await fetch(`${process.env.NEST_API_URL}/auth/refresh`, {
    method: "POST",

    headers: {
      Cookie: `refresh_token=${refreshToken}`,
    },

    cache: "no-store",
  });

  if (!nestResponse.ok) {
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json({ message: "Session expired" }, { status: 401 });
  }

  const data = (await nestResponse.json()) as RefreshResponse;

  // NestJS rotated refresh token
  const setCookie = nestResponse.headers.get("set-cookie");

  const match = setCookie?.match(/refresh_token=([^;]+)/);

  const newRefreshToken = match?.[1];

  if (!newRefreshToken) {
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json(
      {
        message: "Rotated refresh token was not received",
      },
      {
        status: 500,
      },
    );
  }

  // Replace refresh token
  cookieStore.set("refresh_token", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // Replace access token
  cookieStore.set("access_token", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  return NextResponse.json({
    success: true,
  });
}
