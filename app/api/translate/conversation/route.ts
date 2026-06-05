import { NextResponse } from "next/server"
import { z } from "zod"
import { generateConversationTranslation } from "@/lib/gemini"
import { getAppLimitSettings } from "@/lib/app-settings"
import { JLPT_LEVELS, TRANSLATION_DIRECTIONS, TRANSLATION_STYLES } from "@/lib/translate-types"

export const runtime = "nodejs"

const participantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
})

const lineSchema = z.object({
  id: z.string().min(1),
  speakerId: z.string().min(1),
  text: z.string().trim().min(1),
})

const requestSchema = z.object({
  direction: z.enum(TRANSLATION_DIRECTIONS),
  participants: z.array(participantSchema).min(2),
  lines: z.array(lineSchema).min(1),
  jlptLevel: z.enum(JLPT_LEVELS).optional(),
  translationStyle: z.enum(TRANSLATION_STYLES).optional(),
  includeGrammar: z.boolean().default(false),
  includeKana: z.boolean().default(true),
  includeKanji: z.boolean().default(false),
  includeContext: z.boolean().default(true),
})

export async function POST(req: Request) {
  try {
    const settings = await getAppLimitSettings()
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Dữ liệu hội thoại không hợp lệ." } },
        { status: 400 }
      )
    }

    if (parsed.data.participants.length > settings.maxConversationParticipants) {
      return NextResponse.json(
        {
          error: {
            code: "PARTICIPANT_LIMIT",
            message: `Tối đa ${settings.maxConversationParticipants} nhân vật.`,
          },
        },
        { status: 400 }
      )
    }

    const participantIds = new Set(parsed.data.participants.map((participant) => participant.id))
    const invalidLine = parsed.data.lines.find((line) => !participantIds.has(line.speakerId))
    if (invalidLine) {
      return NextResponse.json(
        { error: { code: "INVALID_SPEAKER", message: "Có câu thoại chưa chọn đúng nhân vật." } },
        { status: 400 }
      )
    }

    const result = await generateConversationTranslation(parsed.data)
    return NextResponse.json({ data: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi."
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message } }, { status: 500 })
  }
}

