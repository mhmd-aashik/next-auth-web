import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RefreshResponse {
  accessToken: string;
}

export async function POST() {
  const cookieStore = await cookies();

  const currentRefreshToken = cookieStore.get("refresh_token")?.value;

  if (!currentRefreshToken) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const nestResponse = await fetch(`${process.env.NEST_API_URL}/auth/refresh`, {
    method: "POST",

    headers: {
      Cookie: `refresh_token=${currentRefreshToken}`,
    },

    cache: "no-store",
  });

  if (!nestResponse.ok) {
    cookieStore.delete("refresh_token");

    return NextResponse.json({ message: "Session expired" }, { status: 401 });
  }

  const data = (await nestResponse.json()) as RefreshResponse;

  const setCookie = nestResponse.headers.get("set-cookie");

  if (!setCookie) {
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

  const match = setCookie.match(/refresh_token=([^;]+)/);

  const newRefreshToken = match?.[1];

  if (!newRefreshToken) {
    cookieStore.delete("refresh_token");

    return NextResponse.json(
      {
        message: "Rotated refresh token was not found",
      },
      {
        status: 500,
      },
    );
  }

  cookieStore.set("refresh_token", newRefreshToken, {
    httpOnly: true,

    secure: process.env.NODE_ENV === "production",

    sameSite: "lax",

    path: "/",

    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({
    accessToken: data.accessToken,
  });
}
