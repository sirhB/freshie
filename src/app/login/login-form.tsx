"use client";

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

    try {
      const form = new FormData(e.currentTarget);
      const email = String(form.get("email") || "");
      const password = String(form.get("password") || "");

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: params.get("callbackUrl") || "/studio",
      });

      if (!res) {
        setError("Login got no response. Check AUTH_SECRET and DB_URL on Vercel.");
        return;
      }

      if (res.error) {
        if (res.error === "Configuration") {
          setError("Auth is misconfigured — set AUTH_SECRET in Vercel env.");
        } else {
          setError("Those credentials don’t match the studio.");
        }
        return;
      }

      const next = params.get("callbackUrl") || "/studio";
      router.push(next);
      router.refresh();
    } catch (err) {
      console.error("[login]", err);
      setError("Could not reach the auth service. Reload and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block space-y-2 text-sm">
        <span>Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
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
          autoComplete="current-password"
          defaultValue="createher2026"
          className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none ring-rose/30 focus:ring-2"
        />
      </label>
      {error && (
        <p className="rounded-xl bg-rose/10 px-3 py-2 text-sm text-berry" role="alert">
          {error}
        </p>
      )}
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
