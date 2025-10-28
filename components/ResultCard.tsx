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
    <section className="mt-8 rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-card backdrop-blur">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Name
      </h2>
      <p className="mt-2 text-3xl font-semibold text-neutral-900">{name}</p>

      <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Why
      </h3>
      <p className="mt-2 text-base text-neutral-700">{why}</p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className={clsx(
            "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition",
            "bg-sprout-soft text-neutral-900 hover:bg-sprout focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sprout"
          )}
          aria-label="Copy plant name"
        >
          Copy name
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
          aria-label="Try another plant name"
        >
          Try another
        </button>
        <span
          role="status"
          aria-live="polite"
          className={clsx(
            "text-sm font-medium text-sprout transition-opacity",
            copied ? "opacity-100" : "opacity-0"
          )}
        >
          Copied!
        </span>
      </div>
    </section>
  );
}
