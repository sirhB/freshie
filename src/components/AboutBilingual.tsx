"use client";

import { useState } from "react";

export function AboutBilingual({
  eyebrow,
  headline,
  aboutBody,
  aboutBodyEs,
  aboutBullets,
  aboutBulletsEs,
}: {
  eyebrow: string;
  headline: string;
  aboutBody: string;
  aboutBodyEs: string;
  aboutBullets: string[];
  aboutBulletsEs: string[];
}) {
  const [lang, setLang] = useState<"en" | "es">("en");
  const body = lang === "en" ? aboutBody : aboutBodyEs;
  const bullets = lang === "en" ? aboutBullets : aboutBulletsEs;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm uppercase tracking-[0.22em] text-berry">{eyebrow}</p>
        <div className="flex rounded-full border border-berry/20 bg-white/60 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`rounded-full px-3 py-1 ${
              lang === "en" ? "bg-berry text-pearl" : "text-ink/60"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("es")}
            className={`rounded-full px-3 py-1 ${
              lang === "es" ? "bg-berry text-pearl" : "text-ink/60"
            }`}
          >
            ES
          </button>
        </div>
      </div>
      <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl">
        {headline}
      </h2>
      <p className="mt-5 max-w-xl text-ink/70">{body}</p>
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.16em] text-berry/80">
        <span>New York City</span>
        <span>English &amp; Spanish</span>
        <span>On camera</span>
        <span>~4 day delivery</span>
      </div>
      <ul className="mt-8 space-y-4 text-sm text-ink/80">
        {bullets.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-berry" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
