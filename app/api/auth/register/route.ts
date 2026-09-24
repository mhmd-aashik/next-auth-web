import { NextResponse } from "next/server";

interface RegisterRequest {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as RegisterRequest;

  const nestResponse = await fetch(
    `${process.env.NEST_API_URL}/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),

      cache: "no-store",
    },
  );

  const data = await nestResponse.json();

  return NextResponse.json(data, {
    status: nestResponse.status,
  });
}
