"use client";

import Image from "next/image";
import type { PortfolioShape } from "@/lib/site-content";

export function WorkReelGrid({ items }: { items: PortfolioShape[] }) {
  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => {
        const href = item.mediaUrl || "https://www.instagram.com/kaylathecreateher/";
        return (
          <a
            key={item.id}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group relative block overflow-hidden rounded-[1.25rem] bg-ink/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-berry"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="relative aspect-[9/14] w-full">
              {item.thumbnailUrl ? (
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-violet to-berry" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-pearl/90 text-berry shadow-lg transition group-hover:scale-105">
                <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 fill-current" aria-hidden>
                  <path d="M8 5.5v13l11-6.5L8 5.5z" />
                </svg>
              </span>
              <div className="absolute inset-x-0 bottom-0 p-4 text-pearl">
                <p className="text-[10px] uppercase tracking-[0.18em] text-champagne">
                  {item.category} · {item.platform} Reel
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl leading-tight">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-pearl/75">{item.description}</p>
                )}
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
