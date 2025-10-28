"use client";

import { FormEvent, useMemo, useState } from "react";
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

  const suggestions = [
    "tiny succulent that sunbathes all day",
    "dramatic monstera guarding the sofa",
    "spider plant sprinting across shelves"
  ];

  const trimmedDescription = useMemo(() => description.trim(), [description]);
  const validation = useMemo(
    () => validateDescription(description),
    [description]
  );
  const canSubmit = validation.isValid && status !== "loading";

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
      <header className="pt-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-[32px] border border-emerald-100 bg-white/95 px-6 py-8 shadow-2xl shadow-emerald-200/40 backdrop-blur">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Plant Namer
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-emerald-950 sm:text-5xl">
              Plant Namer
            </h1>
            <p className="mt-3 text-sm text-emerald-700 sm:text-base">
              Describe your leafy friend and get one witty, share-ready name with the perfect why.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="sr-only" htmlFor="plant-description">
                Plant description
              </label>
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
                placeholder='e.g., "cheery pothos trailing from the bookcase"'
                className="h-32 w-full resize-none rounded-3xl border border-emerald-100 bg-white px-5 py-4 text-base text-emerald-900 outline-none placeholder:text-emerald-400 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 sm:text-lg"
                maxLength={MAX_DESCRIPTION_LENGTH}
              />
              <div className="mt-2 flex items-center justify-between text-xs text-emerald-500">
                <span>{trimmedDescription.length} / {MAX_DESCRIPTION_LENGTH}</span>
                <span>Give us the vibe, not a novel.</span>
              </div>
              {validation.message && description.trim().length > 0 && (
                <p className="mt-2 text-sm font-medium text-emerald-700">
                  {validation.message}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setDescription(suggestion);
                    setStatus("idle");
                    setErrorMessage(null);
                  }}
                  className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-100 sm:text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {status === "error" && errorMessage && (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-300/40 transition hover:bg-emerald-500/90 disabled:bg-emerald-200 disabled:text-emerald-600"
              disabled={!canSubmit}
              aria-busy={status === "loading"}
            >
              {status === "loading" ? "Brewing puns…" : "Name my plant"}
            </button>
          </form>
        </div>
      </header>

      {status === "success" && result && (
        <ResultCard
          name={result.name}
          why={result.why}
          onReset={handleReset}
        />
      )}

      <footer className="pb-12 pt-4 text-center text-xs font-medium uppercase tracking-wide text-slate-400">
        Made with leaf-logic, powered by AI.
      </footer>
    </main>
  );
}
