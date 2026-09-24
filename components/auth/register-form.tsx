"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { registerUser } from "@/lib/api/auth";

import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth";
import { ApiError } from "@/lib/api/api-error";

export function RegisterForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);

    try {
      await registerUser(values);

      router.push("/login");
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);
        return;
      }

      setServerError("Something went wrong. Please try again.");
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
        />

        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>

        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />

        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>

        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />

        {errors.confirmPassword && (
          <p className="text-destructive text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {serverError && <p className="text-destructive text-sm">{serverError}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
