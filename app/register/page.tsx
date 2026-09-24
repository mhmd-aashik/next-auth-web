import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Create account</h1>

          <p className="text-muted-foreground text-sm">
            Enter your details to get started
          </p>
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}
