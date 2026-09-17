import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="studio-shell flex min-h-[100svh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="font-[family-name:var(--font-display)] text-2xl text-berry">
          kaylathecreateher
        </Link>
        <h1 className="mt-8 font-[family-name:var(--font-display)] text-4xl text-ink">
          Studio login
        </h1>
        <p className="mt-2 text-sm text-ink/65">
          Private workspace for brand obligations, briefs, and delivery.
        </p>
        <Suspense fallback={<div className="mt-8 h-48 animate-pulse rounded-2xl bg-white/50" />}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-xs text-ink/50">
          Demo: kayla@kaylathecreateher.com / createher2026
        </p>
      </div>
    </main>
  );
}
