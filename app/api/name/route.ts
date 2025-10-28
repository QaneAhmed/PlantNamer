import { NextResponse, type NextRequest } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 3000;
const SYSTEM_PROMPT =
  "You are PlantNamer, an AI that creates a single funny/punny name for a houseplant based on a short description. Your output must be concise, wholesome, family-friendly, and internet-friendly.";
const USER_PROMPT_TEMPLATE = (description: string) => `
Task: Create ONE funny/punny name for a houseplant described below, plus ONE short rationale (max 14 words).

Plant description: "${description}"

Constraints:
- Output EXACTLY two lines:
  1) Name: <the best plant name only, 2–4 words, capitalize sensibly>
  2) Why: <one witty reason, max 14 words, no emojis>
- Keep it family-friendly and light.
- Avoid repeating the plant species in the name unless it improves the pun.
- Don’t include quotes around the name.
`.trim();

const descriptionSchema = z
  .object({
    description: z
      .string({ required_error: "Invalid description" })
      .trim()
      .min(5, "Invalid description")
      .max(300, "Invalid description")
      .refine((value) => /[a-zA-Z0-9]/.test(value), {
        message: "Invalid description"
      })
  })
  .transform((data) => ({
    description: data.description
  }));

const lastRequestTimestamps = new Map<string, number>();

const FALLBACK_RESULT = {
  name: "Leafy McLeaface",
  why: "Cheerful, punny, and easy to like."
};

let cachedOpenAIClient: OpenAI | null = null;

type ParsedResult = {
  name: string;
  why: string;
};

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY environment variable." },
      { status: 500 }
    );
  }

  const rateLimitResponse = applyRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  let parsedBody: { description: string };

  try {
    const body = await request.json();
    const result = descriptionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid description" },
        { status: 400 }
      );
    }

    parsedBody = result.data;
  } catch {
    return NextResponse.json({ error: "Invalid description" }, { status: 400 });
  }

  const { description } = parsedBody;

  try {
    const result = await generatePlantName(description);
    return NextResponse.json(result);
  } catch (error) {
    console.error("PlantNamer error", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

function applyRateLimit(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0]?.trim() : "unknown";
  const now = Date.now();
  const lastRequest = lastRequestTimestamps.get(ip) ?? 0;

  if (now - lastRequest < RATE_LIMIT_WINDOW_MS) {
    return NextResponse.json(
      { error: "Slow down a sprout. Try again in a moment." },
      { status: 429 }
    );
  }

  lastRequestTimestamps.set(ip, now);
  return null;
}

async function generatePlantName(description: string): Promise<ParsedResult> {
  const client = getOpenAIClient();

  const attempts = [
    USER_PROMPT_TEMPLATE(description),
    `${USER_PROMPT_TEMPLATE(
      description
    )}\n\nReminder: Follow the EXACT two-line format (Name:/Why:).`
  ];

  for (const prompt of attempts) {
    const response = await (client as unknown as {
      responses: {
        create: (params: {
          model: string;
          input: Array<{ role: "system" | "user"; content: string }>;
        }) => Promise<{ output_text: string | null | undefined }>;
      };
    }).responses.create({
      model: "gpt-5-mini",
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ]
    });

    const outputText = response.output_text;
    const parsed = parseModelOutput(outputText);

    if (parsed) {
      return parsed;
    }
  }

  return FALLBACK_RESULT;
}

function getOpenAIClient() {
  if (cachedOpenAIClient) {
    return cachedOpenAIClient;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  cachedOpenAIClient = new OpenAI({ apiKey });
  return cachedOpenAIClient;
}

function parseModelOutput(output: string | null | undefined): ParsedResult | null {
  if (!output) {
    return null;
  }

  const lines = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const nameLine = lines.find((line) => line.toLowerCase().startsWith("name:"));
  const whyLine = lines.find((line) => line.toLowerCase().startsWith("why:"));

  if (!nameLine || !whyLine) {
    return null;
  }

  const name = nameLine.slice(5).trim().replace(/^"+|"+$/g, "");
  const why = whyLine.slice(4).trim().replace(/^"+|"+$/g, "");

  if (!name || !why) {
    return null;
  }

  if (name.length > 30) {
    return null;
  }

  const whyWordCount = why.split(/\s+/).filter(Boolean).length;
  if (whyWordCount > 14) {
    return null;
  }

  return { name, why };
}
