"use client";

import { useEffect, useState } from "react";
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
    <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Name
          </p>
          <p className="mt-3 text-4xl font-semibold text-slate-900 sm:text-5xl">
            {name}
          </p>
        </div>
        <span
          role="status"
          aria-live="polite"
          className={`text-sm font-medium text-slate-500 transition-opacity ${copied ? "opacity-100" : "opacity-0"}`}
        >
          Copied!
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Why it fits
        </p>
        <p className="mt-2 text-base text-slate-600 sm:text-lg">{why}</p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          aria-label="Copy plant name"
        >
          <span>Copy name</span>
          <span aria-hidden>📋</span>
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
          aria-label="Try another plant name"
        >
          Try another
        </button>
      </div>
    </section>
  );
}
