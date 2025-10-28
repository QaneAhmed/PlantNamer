"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

type ResultCardProps = {
  name: string;
  why: string;
  onReset: () => void;
};

export default function ResultCard({ name, why, onReset }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="relative mt-10 overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-white p-8 text-neutral-900 shadow-xl">
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-200/40 blur-3xl" aria-hidden />
      <div className="absolute -bottom-20 left-16 h-48 w-48 rounded-full bg-lime-200/30 blur-3xl" aria-hidden />
      <div className="relative z-[1] flex flex-col gap-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Name reveal
          </span>
          <span
            role="status"
            aria-live="polite"
            className={clsx(
              "text-sm font-medium text-emerald-600 transition-opacity",
              copied ? "opacity-100" : "opacity-0"
            )}
          >
            Copied!
          </span>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white/80 px-6 py-5 shadow-inner">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-500">
            Name
          </p>
          <p className="mt-2 text-4xl font-semibold leading-tight text-neutral-900 sm:text-5xl">
            {name}
          </p>
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/70 px-6 py-5 shadow-inner">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-500">
            Why
          </p>
          <p className="mt-2 text-base text-neutral-700 sm:text-lg">{why}</p>
        </div>
      </div>

      <div className="relative z-[1] mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className={clsx(
            "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition",
            "bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-md shadow-emerald-500/30 hover:shadow-emerald-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          )}
          aria-label="Copy plant name"
        >
          <span>Copy name</span>
          <span aria-hidden>📋</span>
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-2xl border border-emerald-100 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:border-emerald-200 hover:text-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
          aria-label="Try another plant name"
        >
          Try another
        </button>
      </div>
    </section>
  );
}
