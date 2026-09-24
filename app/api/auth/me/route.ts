import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const nestResponse = await fetch(`${process.env.NEST_API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },

    cache: "no-store",
  });

  if (!nestResponse.ok) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: nestResponse.status,
      },
    );
  }

  const user = await nestResponse.json();

  return NextResponse.json(user);
}
