import type { LoginFormValues } from "@/lib/validations/auth";

export interface User {
  id: string;
  email: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export async function login(values: LoginFormValues): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  return response.json() as Promise<LoginResponse>;
}
