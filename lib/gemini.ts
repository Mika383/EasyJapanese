type GeminiImageInput = {
  data: string
  mimeType: string
}

export type GrammarExample = {
  jp: string
  vi: string
}

export type GrammarPoint = {
  title: string
  explanation: string
  examples: GrammarExample[]
}

export type TranslateResult = {
  sourceText: string
  kanaReading: string
  romaji?: string
  translationText: string
  sourceLang: "JA" | "VI"
  targetLang: "JA" | "VI"
  grammarPoints: GrammarPoint[]
  ocrText?: string
  notes?: string[]
}

type TranslateInput = {
  text?: string
  image?: GeminiImageInput
  includeGrammar: boolean
  includeKana: boolean
  sourceLang: "JA" | "VI"
  targetLang: "JA" | "VI"
}

type GeminiContentPart =
  | { text: string }
  | {
      inline_data: {
        mime_type: string
        data: string
      }
    }

const GEMINI_MODEL = "gemini-2.5-flash-lite"

const SYSTEM_INSTRUCTION = [
  "Bạn là trợ lý dịch tiếng Nhật sang tiếng Việt.",
  "Ưu tiên dịch tự nhiên, rõ nghĩa.",
  "Luôn trả về JSON đúng schema, không thêm markdown.",
  "Nếu không yêu cầu giải thích ngữ pháp thì trả về grammarPoints là mảng rỗng.",
  "Cung cấp chú thích Hán tự sang hiragana trong trường kanaReading.",
].join(" ")

const buildUserPrompt = (input: TranslateInput) => {
  const base = [
    "Nhiệm vụ:",
    "1) Nếu có ảnh, hãy OCR tiếng Nhật trong ảnh và điền vào sourceText + ocrText.",
    `2) Dịch từ ${input.sourceLang} sang ${input.targetLang}.`,
    "3) Nếu includeGrammar=true, phân tích ngữ pháp tiếng Nhật ngắn gọn theo từng điểm, có ví dụ JP + nghĩa.",
  ]

  const grammarLine = input.includeGrammar
    ? "includeGrammar=true"
    : "includeGrammar=false"

  const kanaLine = input.includeKana
    ? "includeKana=true"
    : "includeKana=false"

  return [base.join(" "), grammarLine, kanaLine].join(" ")
}

const buildSchema = () => ({
  type: "OBJECT",
  properties: {
    sourceText: { type: "STRING" },
    kanaReading: { type: "STRING" },
    romaji: { type: "STRING" },
    translationText: { type: "STRING" },
    sourceLang: { type: "STRING" },
    targetLang: { type: "STRING" },
    grammarPoints: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          explanation: { type: "STRING" },
          examples: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                jp: { type: "STRING" },
                vi: { type: "STRING" },
              },
              required: ["jp", "vi"],
            },
          },
        },
        required: ["title", "explanation", "examples"],
      },
    },
    ocrText: { type: "STRING" },
    notes: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["sourceText", "translationText", "sourceLang", "targetLang", "grammarPoints"],
})

const normalizeLang = (value: string | undefined, fallback: "JA" | "VI") => {
  if (!value) return fallback
  const upper = value.toUpperCase()
  if (upper === "JA" || upper === "VI") return upper
  return fallback
}

export async function generateTranslation(input: TranslateInput): Promise<TranslateResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("Thiếu GEMINI_API_KEY")
  }

  const parts: GeminiContentPart[] = [{ text: buildUserPrompt(input) }]

  if (input.text) {
    parts.push({ text: `Văn bản: ${input.text}` })
  }

  if (input.image) {
    parts.push({
      inline_data: {
        mime_type: input.image.mimeType,
        data: input.image.data,
      },
    })
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            role: "user",
            parts,
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: buildSchema(),
          temperature: 0.2,
        },
      }),
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Gemini API lỗi")
  }

  const data = await response.json()
  const textOutput =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    data?.candidates?.[0]?.content?.parts?.[0]

  if (!textOutput) {
    throw new Error("Không nhận được phản hồi từ Gemini")
  }

  const parsed = typeof textOutput === "string" ? JSON.parse(textOutput) : textOutput

  const grammarPoints = input.includeGrammar ? parsed.grammarPoints ?? [] : []
  const kanaReading = input.includeKana ? parsed.kanaReading ?? "" : ""

  return {
    sourceText: parsed.sourceText ?? "",
    kanaReading,
    romaji: parsed.romaji,
    translationText: parsed.translationText ?? "",
    sourceLang: normalizeLang(parsed.sourceLang, input.sourceLang),
    targetLang: normalizeLang(parsed.targetLang, input.targetLang),
    grammarPoints,
    ocrText: parsed.ocrText,
    notes: parsed.notes ?? [],
  }
}
