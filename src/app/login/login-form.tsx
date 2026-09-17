"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Those credentials don’t match the studio.");
      return;
    }
    router.push(params.get("callbackUrl") || "/studio");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block space-y-2 text-sm">
        <span>Email</span>
        <input
          name="email"
          type="email"
          required
          defaultValue="kayla@kaylathecreateher.com"
          className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none ring-rose/30 focus:ring-2"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span>Password</span>
        <input
          name="password"
          type="password"
          required
          defaultValue="createher2026"
          className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none ring-rose/30 focus:ring-2"
        />
      </label>
      {error && <p className="text-sm text-rose">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-berry py-3 text-sm font-semibold text-pearl hover:bg-ink disabled:opacity-60"
      >
        {loading ? "Opening studio..." : "Enter studio"}
      </button>
    </form>
  );
}

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
        <LoginForm />
        <p className="mt-6 text-xs text-ink/50">
          Demo: kayla@kaylathecreateher.com / createher2026
        </p>
      </div>
    </main>
  );
}
