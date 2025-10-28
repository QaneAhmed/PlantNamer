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
    <main className="flex flex-1 flex-col">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          PlantNamer 🌿
        </h1>
        <p className="mt-3 text-base text-neutral-600">
          Give your plant a name it will <em>actually</em> respond to.
        </p>
      </header>

      <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="sr-only" htmlFor="plant-description">
            Plant description
          </label>
          <input
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
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-base text-neutral-900 shadow-sm outline-none transition focus:border-sprout focus:ring-2 focus:ring-sprout"
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
          {validation.message && description.trim().length > 0 && (
            <p className="text-sm text-red-500">{validation.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className={clsx(
              "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-base font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sprout",
              canSubmit
                ? "bg-neutral-900 hover:bg-neutral-800"
                : "bg-neutral-300 text-neutral-500"
            )}
            disabled={!canSubmit}
            aria-busy={status === "loading"}
          >
            {status === "loading" ? "Brewing puns…" : "Name my plant"}
          </button>
          <p className="text-sm text-neutral-500">
            We’ll give you one best name + a one-liner why.
          </p>
        </div>

        {status === "error" && errorMessage && (
          <p className="text-sm font-medium text-red-500">{errorMessage}</p>
        )}
      </form>

      {status === "success" && result && (
        <ResultCard
          name={result.name}
          why={result.why}
          onReset={handleReset}
        />
      )}

      <footer className="mt-auto pt-12 text-xs uppercase tracking-wide text-neutral-400">
        Made with leaf-logic, powered by AI.
      </footer>
    </main>
  );
}
