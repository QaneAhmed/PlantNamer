"use client";

import { FormEvent, useMemo, useState } from "react";
import clsx from "clsx";
import ResultCard from "../components/ResultCard";

const MIN_DESCRIPTION_LENGTH = 5;
const MAX_DESCRIPTION_LENGTH = 300;

type Status = "idle" | "loading" | "success" | "error";

type GenerationResult = {
  name: string;
  why: string;
};

const ERROR_TEXT = "The fern got stage fright. Try again?";

function validateDescription(value: string) {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      message: ""
    };
  }

  if (trimmed.length < MIN_DESCRIPTION_LENGTH) {
    return {
      isValid: false,
      message: "Please describe your plant in at least 5 characters."
    };
  }

  if (trimmed.length > MAX_DESCRIPTION_LENGTH) {
    return {
      isValid: false,
      message: "Keep it under 300 characters so we can stay snappy."
    };
  }

  if (!/[a-zA-Z0-9]/.test(trimmed)) {
    return {
      isValid: false,
      message: "Add a few letters so we can read the vibe."
    };
  }

  return {
    isValid: true,
    message: ""
  };
}

export default function HomePage() {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const trimmedDescription = useMemo(() => description.trim(), [description]);
  const validation = useMemo(
    () => validateDescription(description),
    [description]
  );
  const canSubmit = validation.isValid && status !== "loading";

  const ideaChips = [
    "dramatic monstera with a cozy corner",
    "tiny cactus in a neon pot",
    "ivy that refuses to stay put",
    "orchid that thrives on compliments"
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validation.isValid) {
      setErrorMessage(null);
      return;
    }

    setStatus("loading");
    setResult(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ description: trimmedDescription })
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = (await response.json()) as GenerationResult;
      setResult(data);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(ERROR_TEXT);
    }
  };

  const handleReset = () => {
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
  };

  return (
    <main className="flex flex-1 flex-col gap-10">
      <header className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-white via-emerald-50 to-emerald-100 px-6 py-10 shadow-lg sm:px-10">
        <div className="absolute right-6 top-6 hidden h-24 w-24 rotate-12 rounded-full border border-emerald-200 bg-white/80 text-center text-xs font-semibold uppercase tracking-wide text-emerald-600 shadow-inner sm:flex sm:flex-col sm:items-center sm:justify-center">
          <span className="text-2xl">🌱</span>
          <span>Plant vibes</span>
        </div>
        <div className="sm:w-4/5">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1 text-sm font-medium text-emerald-700 shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Instant leafy identity
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            PlantNamer 🌿
          </h1>
          <p className="mt-4 text-lg text-neutral-600 sm:text-xl">
            Give your plant a name it will <em>actually</em> respond to. We blend
            botanical wit with AI whimsy for a punchline your fern will flex to.
          </p>
        </div>
        <dl className="mt-8 grid gap-4 text-sm text-neutral-600 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-white/70 px-4 py-3 shadow-sm">
            <dt className="font-semibold text-neutral-800">One-line roasts? Never.</dt>
            <dd className="mt-1 text-neutral-600">
              Every name is kind, clever, and pun-forward in under five seconds.
            </dd>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white/70 px-4 py-3 shadow-sm">
            <dt className="font-semibold text-neutral-800">Houseplants only.</dt>
            <dd className="mt-1 text-neutral-600">
              From drama queens to desert divas—we translate your vibe note perfectly.
            </dd>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white/70 px-4 py-3 shadow-sm">
            <dt className="font-semibold text-neutral-800">Share-ready.</dt>
            <dd className="mt-1 text-neutral-600">
              Results look sharp on stories, group chats, and plant-swap brag threads.
            </dd>
          </div>
        </dl>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-md backdrop-blur">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-neutral-700" htmlFor="plant-description">
                Describe your plant&apos;s whole personality
              </label>
              <div className="relative">
                <textarea
                  id="plant-description"
                  name="description"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    if (status === "error") {
                      setErrorMessage(null);
                      setStatus("idle");
                    }
                  }}
                  aria-label="Plant description"
                  aria-invalid={Boolean(
                    validation.message && description.trim().length > 0
                  )}
                  disabled={status === "loading"}
                  placeholder='e.g., "tall snake plant with dramatic leaves" or "tiny succulent that loves sunlight"'
                  className="h-40 w-full resize-none rounded-3xl border border-emerald-100 bg-white px-5 py-4 text-base text-neutral-900 shadow-inner outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200/70 sm:text-lg"
                  maxLength={MAX_DESCRIPTION_LENGTH}
                />
                <div className="pointer-events-none absolute inset-x-5 bottom-3 flex justify-between text-xs text-neutral-400">
                  <span>{trimmedDescription.length} / {MAX_DESCRIPTION_LENGTH}</span>
                  <span>Keep it leafy, keep it lovely.</span>
                </div>
              </div>
              {validation.message && description.trim().length > 0 && (
                <p className="text-sm font-medium text-rose-500">
                  {validation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                className={clsx(
                  "group inline-flex w-full items-center justify-center gap-3 rounded-3xl px-6 py-4 text-lg font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400",
                  canSubmit
                    ? "bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-400 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40"
                    : "bg-neutral-300 text-neutral-500 shadow-none"
                )}
                disabled={!canSubmit}
                aria-busy={status === "loading"}
              >
                <span>{status === "loading" ? "Brewing puns…" : "Name my plant"}</span>
                <span
                  className={clsx(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/20 text-base transition",
                    status === "loading" && "animate-spin-slow"
                  )}
                  aria-hidden
                >
                  {status === "loading" ? "🌀" : "✨"}
                </span>
              </button>
              <p className="text-sm text-neutral-500">
                We’ll give you one best name + a one-liner why.
              </p>
            </div>

            {status === "error" && errorMessage && (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                {errorMessage}
              </p>
            )}
          </form>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-md backdrop-blur">
            <h2 className="text-base font-semibold text-neutral-800">Need inspo?</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Drop in the quirks—habits, pots, favorite playlists. The richer the vibe,
              the better the name.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {ideaChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setDescription(chip);
                    setStatus("idle");
                    setErrorMessage(null);
                  }}
                  className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-100"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-white p-6 shadow-md">
            <h2 className="text-base font-semibold text-neutral-800">
              How to score a legendary name
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-neutral-600">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  1
                </span>
                Give us the plant’s vibe, not just species. Drama, sun cravings, personality.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  2
                </span>
                Add a fun detail—a favorite windowsill, a signature pot, a mood swing.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  3
                </span>
                Hit “Name my plant” and get a punny identity plus the why in one line.
              </li>
            </ul>
          </div>
        </aside>
      </section>

      {status === "success" && result && (
        <ResultCard
          name={result.name}
          why={result.why}
          onReset={handleReset}
        />
      )}

      <section className="rounded-3xl border border-white/60 bg-white/70 px-6 py-8 shadow-md backdrop-blur lg:px-10">
        <h2 className="text-lg font-semibold text-neutral-800">
          Trending leafy alter egos
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white px-4 py-5 text-sm text-neutral-700 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-emerald-500">
              Sun worshipper
            </p>
            <p className="mt-2 text-lg font-semibold text-neutral-900">
              Ray Charles Jr.
            </p>
            <p className="mt-2 text-sm">
              For the succulent that insists on front-row window seating.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-white px-4 py-5 text-sm text-neutral-700 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-emerald-500">
              Moody foliage
            </p>
            <p className="mt-2 text-lg font-semibold text-neutral-900">
              Leafoncé Knowles
            </p>
            <p className="mt-2 text-sm">
              For the fiddle-leaf that sings only under perfect humidity.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50 px-4 py-5 text-sm text-neutral-700 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-emerald-500">
              Kitchen sprinter
            </p>
            <p className="mt-2 text-lg font-semibold text-neutral-900">
              Whisker Vine
            </p>
            <p className="mt-2 text-sm">
              For the spider plant that outruns your grocery list.
            </p>
          </div>
        </div>
      </section>

      <footer className="pt-4 text-center text-xs uppercase tracking-wide text-neutral-400">
        Made with leaf-logic, powered by AI.
      </footer>
    </main>
  );
}
