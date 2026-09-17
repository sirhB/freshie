"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="studio-shell flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-rose">Something glitched</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-ink">
        This page couldn&apos;t load
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink/65">
        A server error occurred. If this is production, confirm Vercel has{" "}
        <code className="text-xs">DB_URL</code> and{" "}
        <code className="text-xs">AUTH_SECRET</code> set, then redeploy.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-full bg-berry px-6 py-3 text-sm font-semibold text-pearl"
      >
        Try again
      </button>
    </main>
  );
}
