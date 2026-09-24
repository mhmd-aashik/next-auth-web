import type {
  LoginFormValues,
  RegisterFormValues,
} from "@/lib/validations/auth";
import { createApiError } from "./api-error";

export interface User {
  id: string;
  email: string;
}

export interface LoginResponse {
  user: User;
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
    throw await createApiError(response);
  }

  return response.json() as Promise<LoginResponse>;
}

export async function registerUser(values: RegisterFormValues): Promise<void> {
  const response = await fetch("/api/auth/register", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email: values.email,
      password: values.password,
    }),
  });

  if (!response.ok) {
    throw await createApiError(response);
  }
}
