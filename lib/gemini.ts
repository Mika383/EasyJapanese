import type {
  ConversationLineInput,
  ConversationParticipant,
  ConversationTranslationResult,
  JlptLevel,
  TranslationDirection,
  TranslationStyle,
} from "@/lib/translate-types"

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

export type KanjiExplanation = {
  kanji: string
  reading: string
  meaning: string
  note: string
}

export type TranslateResult = {
  direction: TranslationDirection
  sourceText: string
  kanaReading: string
  romaji?: string
  translationVi: string
  jlptLevel?: JlptLevel
  translationStyle?: TranslationStyle
  grammarPoints: GrammarPoint[]
  kanjiExplanations: KanjiExplanation[]
  ocrText?: string
  notes?: string[]
}

type TranslateInput = {
  text?: string
  image?: GeminiImageInput
  direction: TranslationDirection
  jlptLevel?: JlptLevel
  translationStyle?: TranslationStyle
  includeGrammar: boolean
  includeKana: boolean
  includeKanji: boolean
}

type ConversationTranslateInput = {
  direction: TranslationDirection
  participants: ConversationParticipant[]
  lines: ConversationLineInput[]
  jlptLevel?: JlptLevel
  translationStyle?: TranslationStyle
  includeGrammar: boolean
  includeKana: boolean
  includeKanji: boolean
  includeContext: boolean
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

const getDirectionInstruction = (input: TranslateInput) => {
  if (input.direction === "VI_TO_JP") {
    return [
      "Chiều dịch bắt buộc: tiếng Việt sang tiếng Nhật.",
      "sourceText phải là nguyên văn tiếng Việt người dùng nhập.",
      "translationVi phải là bản dịch tiếng Nhật, dù tên field là translationVi.",
      "Tuyệt đối không đưa bản dịch tiếng Nhật vào sourceText và không đưa tiếng Việt vào translationVi.",
      `Trình độ mục tiêu: ${input.jlptLevel ?? "N5"}.`,
      input.translationStyle === "SPOKEN"
        ? "Kiểu dịch: văn nói tự nhiên, dễ dùng trong giao tiếp."
        : "Kiểu dịch: đúng ngữ pháp, bám sát cấu trúc tiếng Nhật ở trình độ đã chọn.",
    ].join(" ")
  }

  return [
    "Chiều dịch bắt buộc: tiếng Nhật sang tiếng Việt.",
    "sourceText phải là nguyên văn tiếng Nhật người dùng nhập hoặc văn bản OCR từ ảnh.",
    "translationVi phải là bản dịch tiếng Việt.",
    "Tuyệt đối không đưa tiếng Việt vào sourceText và không đưa tiếng Nhật vào translationVi.",
  ].join(" ")
}

const buildSystemInstruction = (input: TranslateInput) => {
  const roleLine =
    input.direction === "VI_TO_JP"
      ? "Bạn là trợ lý dịch tiếng Việt sang tiếng Nhật cho người học tiếng Nhật."
      : "Bạn là trợ lý dịch tiếng Nhật sang tiếng Việt cho người học tiếng Nhật."

  return [
    roleLine,
    getDirectionInstruction(input),
    "Luôn trả về JSON đúng schema, không thêm markdown.",
    "Không tự đảo chiều dịch, kể cả khi tên field có vẻ gây nhầm lẫn.",
    "Nếu không yêu cầu giải thích ngữ pháp thì trả về grammarPoints là mảng rỗng.",
    "Nếu không yêu cầu giải thích Hán tự thì trả về kanjiExplanations là mảng rỗng.",
    "Chỉ điền ocrText khi input thật sự có ảnh. Nếu input là text, không điền ocrText.",
  ].join(" ")
}

const buildUserPrompt = (input: TranslateInput) => {
  const grammarLine = input.includeGrammar ? "includeGrammar=true" : "includeGrammar=false"
  const kanaLine = input.includeKana ? "includeKana=true" : "includeKana=false"
  const kanjiLine = input.includeKanji ? "includeKanji=true" : "includeKanji=false"
  const inputModeLine = input.image ? "inputMode=image" : "inputMode=text"

  return [
    "Nhiệm vụ:",
    getDirectionInstruction(input),
    input.image
      ? "Có ảnh: OCR tiếng Nhật trong ảnh rồi dịch theo chiều Nhật -> Việt. Điền ocrText bằng văn bản OCR."
      : "Không có ảnh: không điền ocrText.",
    "Nếu includeGrammar=true, phân tích ngữ pháp ngắn gọn theo từng điểm, có ví dụ JP + nghĩa VI.",
    "Nếu includeKanji=true, giải thích các Hán tự quan trọng trong phần tiếng Nhật.",
    "Nếu includeKana=true, cung cấp hiragana/furigana đọc Hán tự trong kanaReading.",
    inputModeLine,
    grammarLine,
    kanaLine,
    kanjiLine,
  ].join(" ")
}

const buildSchema = () => ({
  type: "OBJECT",
  properties: {
    sourceText: { type: "STRING" },
    kanaReading: { type: "STRING" },
    romaji: { type: "STRING" },
    translationVi: { type: "STRING" },
    kanjiExplanations: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          kanji: { type: "STRING" },
          reading: { type: "STRING" },
          meaning: { type: "STRING" },
          note: { type: "STRING" },
        },
        required: ["kanji", "reading", "meaning", "note"],
      },
    },
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
  required: ["sourceText", "kanaReading", "translationVi", "grammarPoints", "kanjiExplanations"],
})

const buildConversationSchema = () => ({
  type: "OBJECT",
  properties: {
    lines: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          speakerId: { type: "STRING" },
          speakerName: { type: "STRING" },
          text: { type: "STRING" },
          translatedText: { type: "STRING" },
          kanaReading: { type: "STRING" },
          grammarNotes: { type: "ARRAY", items: { type: "STRING" } },
          contextNotes: { type: "ARRAY", items: { type: "STRING" } },
        },
        required: ["id", "speakerId", "speakerName", "text", "translatedText", "grammarNotes", "contextNotes"],
      },
    },
    wholeSummary: { type: "STRING" },
    participantSummaries: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          participantId: { type: "STRING" },
          participantName: { type: "STRING" },
          summary: { type: "STRING" },
        },
        required: ["participantId", "participantName", "summary"],
      },
    },
    grammarAnalysis: { type: "ARRAY", items: { type: "STRING" } },
    contextAnalysis: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["lines", "wholeSummary", "participantSummaries", "grammarAnalysis", "contextAnalysis"],
})

export async function generateTranslation(input: TranslateInput): Promise<TranslateResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("Thiếu GEMINI_API_KEY")
  }

  const parts: GeminiContentPart[] = [{ text: buildUserPrompt(input) }]

  if (input.text) {
    parts.push({ text: `Văn bản gốc cần dịch: ${input.text}` })
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
          parts: [{ text: buildSystemInstruction(input) }],
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
  const sourceText = input.text?.trim() || parsed.sourceText || parsed.ocrText || ""

  return {
    direction: input.direction,
    sourceText,
    kanaReading: input.includeKana ? parsed.kanaReading ?? "" : "",
    romaji: parsed.romaji,
    translationVi: parsed.translationVi ?? "",
    jlptLevel: input.jlptLevel,
    translationStyle: input.translationStyle,
    grammarPoints: input.includeGrammar ? parsed.grammarPoints ?? [] : [],
    kanjiExplanations: input.includeKanji ? parsed.kanjiExplanations ?? [] : [],
    ocrText: input.image ? parsed.ocrText : undefined,
    notes: parsed.notes ?? [],
  }
}

export async function generateConversationTranslation(
  input: ConversationTranslateInput
): Promise<ConversationTranslationResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("Thiếu GEMINI_API_KEY")
  }

  const directionInstruction =
    input.direction === "VI_TO_JP"
      ? [
          "Dịch hội thoại từ tiếng Việt sang tiếng Nhật.",
          "translatedText phải là tiếng Nhật.",
          `Trình độ mục tiêu: ${input.jlptLevel ?? "N5"}.`,
          input.translationStyle === "SPOKEN"
            ? "Văn phong: văn nói tự nhiên, hội thoại đời thường."
            : "Văn phong: đúng ngữ pháp, bám sát cấu trúc tiếng Nhật theo trình độ đã chọn.",
        ].join(" ")
      : "Dịch hội thoại từ tiếng Nhật sang tiếng Việt. translatedText phải là tiếng Việt."

  const prompt = [
    "Bạn là trợ lý dịch hội thoại cho người học tiếng Nhật.",
    directionInstruction,
    "Giữ nguyên thứ tự tuyến tính của từng câu.",
    "Mỗi line output phải giữ đúng id, speakerId, text gốc và speakerName.",
    "Không tự thêm, xoá hoặc gộp câu thoại.",
    input.includeKana ? "Nếu có tiếng Nhật, cung cấp kanaReading khi hữu ích." : "Không cần kanaReading.",
    input.includeGrammar ? "Phân tích ngữ pháp ngắn gọn cho từng câu và toàn đoạn." : "grammarNotes và grammarAnalysis để mảng rỗng.",
    input.includeContext ? "Phân tích ngữ cảnh, quan hệ lượt lời và sắc thái hội thoại." : "contextNotes và contextAnalysis để mảng rỗng.",
    input.includeKanji ? "Khi có Hán tự quan trọng, có thể nhắc trong grammarNotes hoặc contextNotes." : "Không cần giải thích Hán tự.",
    `Nhân vật: ${JSON.stringify(input.participants)}`,
    `Hội thoại: ${JSON.stringify(input.lines)}`,
  ].join(" ")

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
          parts: [{ text: prompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: "Dịch và phân tích hội thoại theo JSON schema." }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: buildConversationSchema(),
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

  return {
    direction: input.direction,
    participants: input.participants,
    lines: Array.isArray(parsed.lines) ? parsed.lines : [],
    wholeSummary: parsed.wholeSummary ?? "",
    participantSummaries: Array.isArray(parsed.participantSummaries)
      ? parsed.participantSummaries
      : [],
    grammarAnalysis: input.includeGrammar && Array.isArray(parsed.grammarAnalysis) ? parsed.grammarAnalysis : [],
    contextAnalysis: input.includeContext && Array.isArray(parsed.contextAnalysis) ? parsed.contextAnalysis : [],
    jlptLevel: input.jlptLevel,
    translationStyle: input.translationStyle,
  }
}
