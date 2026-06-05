import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { generateTranslation } from "@/lib/gemini"
import { getAppLimitSettings } from "@/lib/app-settings"
import {
  JLPT_LEVELS,
  TRANSLATION_DIRECTIONS,
  TRANSLATION_STYLES,
  type JlptLevel,
  type TranslationDirection,
  type TranslationStyle,
} from "@/lib/translate-types"

export const runtime = "nodejs"

type TranslateRequest = {
  text?: string
  image?: {
    data: string
    mimeType: string
  }
  direction?: TranslationDirection
  jlptLevel?: JlptLevel
  translationStyle?: TranslationStyle
  includeGrammar?: boolean
  includeKana?: boolean
  includeKanji?: boolean
}

const VN_OFFSET_MS = 7 * 60 * 60 * 1000

const getVietnamPeriodStart = (now: Date) => {
  const vnNow = new Date(now.getTime() + VN_OFFSET_MS)
  const vnHour = vnNow.getUTCHours()
  let year = vnNow.getUTCFullYear()
  let month = vnNow.getUTCMonth()
  let day = vnNow.getUTCDate()

  if (vnHour < 12) {
    const prevDay = new Date(Date.UTC(year, month, day) - 24 * 60 * 60 * 1000)
    year = prevDay.getUTCFullYear()
    month = prevDay.getUTCMonth()
    day = prevDay.getUTCDate()
  }

  const startUtc = Date.UTC(year, month, day, 12, 0, 0) - VN_OFFSET_MS
  return new Date(startUtc)
}

const errorResponse = (status: number, message: string, details?: Record<string, string>) =>
  NextResponse.json(
    {
      error: {
        code: "VALIDATION_ERROR",
        message,
        details,
      },
    },
    { status }
  )

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    const role = session?.user?.role ?? "STUDENT"
    const body = (await req.json()) as TranslateRequest
    const text = body.text?.trim()
    const image = body.image
    const direction = TRANSLATION_DIRECTIONS.includes(body.direction ?? "JP_TO_VI")
      ? body.direction ?? "JP_TO_VI"
      : "JP_TO_VI"
    const jlptLevel = JLPT_LEVELS.includes(body.jlptLevel ?? "N5")
      ? body.jlptLevel ?? "N5"
      : "N5"
    const translationStyle = TRANSLATION_STYLES.includes(body.translationStyle ?? "STRUCTURED")
      ? body.translationStyle ?? "STRUCTURED"
      : "STRUCTURED"
    const includeGrammar = body.includeGrammar ?? false
    const includeKana = body.includeKana ?? true
    const includeKanji = body.includeKanji ?? false

    if (!userId && (image || includeGrammar)) {
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Tính năng dịch ảnh và giải thích ngữ pháp chỉ dành cho thành viên.",
          },
        },
        { status: 401 }
      )
    }

    if (direction === "VI_TO_JP" && image) {
      return errorResponse(400, "Dịch từ ảnh chỉ hỗ trợ chiều Nhật sang Việt.", {
        image: "unsupported_for_direction",
      })
    }

    if (userId && includeGrammar && role === "STUDENT") {
      const settings = await getAppLimitSettings()
      const usageModel = (prisma as unknown as {
        grammarExplainUsage?: {
          findUnique: (args: {
            where: { userId_periodStart: { userId: string; periodStart: Date } }
          }) => Promise<{ count: number } | null>
          upsert: (args: {
            where: { userId_periodStart: { userId: string; periodStart: Date } }
            update: { count: { increment: number } }
            create: { userId: string; periodStart: Date; count: number }
          }) => Promise<{ count: number }>
        }
      }).grammarExplainUsage
      if (!usageModel) {
        return NextResponse.json(
          {
            error: {
              code: "MIGRATION_REQUIRED",
              message: "Chưa áp dụng migration cho giới hạn ngữ pháp. Vui lòng migrate/generate Prisma.",
            },
          },
          { status: 500 }
        )
      }
      const periodStart = getVietnamPeriodStart(new Date())
      const usage = await usageModel.findUnique({
        where: { userId_periodStart: { userId, periodStart } },
      })

      if (usage && usage.count >= settings.grammarDailyLimit) {
        return NextResponse.json(
          {
            error: {
              code: "LIMIT_REACHED",
              message: "Bạn đã dùng hết lượt giải thích ngữ pháp hôm nay.",
            },
          },
          { status: 429 }
        )
      }

      await usageModel.upsert({
        where: { userId_periodStart: { userId, periodStart } },
        update: { count: { increment: 1 } },
        create: { userId, periodStart, count: 1 },
      })
    }

    if (!text && !image) {
      return errorResponse(400, "Vui lòng nhập văn bản hoặc tải ảnh.", {
        text: "missing",
        image: "missing",
      })
    }

    const result = await generateTranslation({
      text: text || undefined,
      image: image?.data ? image : undefined,
      direction,
      jlptLevel: direction === "VI_TO_JP" ? jlptLevel : undefined,
      translationStyle: direction === "VI_TO_JP" ? translationStyle : undefined,
      includeGrammar,
      includeKana,
      includeKanji,
    })

    return NextResponse.json({ data: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi."
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message,
        },
      },
      { status: 500 }
    )
  }
}
