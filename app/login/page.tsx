import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Welcome back</h1>

          <p className="text-muted-foreground text-sm">
            Sign in to your account
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
