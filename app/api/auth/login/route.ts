import { isAllowedOrigin } from "@/lib/security/origin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
}

export async function POST(request: Request) {
  // CSRF protection
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as LoginRequest;

  const nestResponse = await fetch(`${process.env.NEST_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!nestResponse.ok) {
    return NextResponse.json(
      {
        message: "Invalid email or password",
      },
      {
        status: nestResponse.status,
      },
    );
  }

  const data = (await nestResponse.json()) as LoginResponse;

  const setCookie = nestResponse.headers.get("set-cookie");

  if (!setCookie) {
    return NextResponse.json(
      {
        message: "Refresh token was not received",
      },
      {
        status: 500,
      },
    );
  }

  const match = setCookie.match(/refresh_token=([^;]+)/);

  const refreshToken = match?.[1];

  if (!refreshToken) {
    return NextResponse.json(
      {
        message: "Refresh token was not found",
      },
      {
        status: 500,
      },
    );
  }

  const cookieStore = await cookies();

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set("access_token", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",

    // Match this to your NestJS access-token TTL.
    maxAge: 60 * 15,
  });

  return NextResponse.json({
    user: data.user,
  });
}
