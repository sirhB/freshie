"use client";

import { FormEvent, useState } from "react";

export function InquiryForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      setStatus("error");
      return;
    }
    setStatus("done");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Brand" name="brandName" required />
        <Field label="Your name" name="contactName" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Budget range" name="budget" placeholder="$60–$120 / video" />
      </div>
      <Field
        label="Platforms"
        name="platforms"
        placeholder="TikTok, Instagram, YouTube Shorts, Amazon"
      />
      <label className="block space-y-2 text-sm">
        <span className="text-ink/70">What do you need?</span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 outline-none ring-rose/40 focus:ring-2"
          placeholder="Tell Kayla about the product, talking points, timeline, and usage rights."
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center rounded-full bg-berry px-6 py-3 text-sm font-semibold text-pearl transition hover:bg-ink disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send collaboration brief"}
      </button>
      {status === "done" && (
        <p className="text-sm text-success">Received — Kayla will review in studio.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-rose">Something went wrong. Try again in a moment.</p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="text-ink/70">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 outline-none ring-rose/40 focus:ring-2"
      />
    </label>
  );
}
