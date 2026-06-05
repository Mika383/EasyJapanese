import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { auth } from "@/auth"
import { getAppLimitSettings } from "@/lib/app-settings"
import { prisma } from "@/lib/prisma"
import type { JlptLevel, TranslationDirection, TranslationStyle } from "@/lib/translate-types"

export const runtime = "nodejs"

type SaveRequest = {
  direction?: TranslationDirection
  sourceText: string
  kanaReading?: string
  romaji?: string
  translationVi: string
  jlptLevel?: JlptLevel
  translationStyle?: TranslationStyle
  grammarPoints?: unknown
  kanjiExplanations?: unknown
  ocrText?: string
  notes?: unknown
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
    if (!userId) {
      return NextResponse.json(
        {
          error: { code: "UNAUTHORIZED", message: "Vui lòng đăng nhập để lưu." },
        },
        { status: 401 }
      )
    }

    const body = (await req.json()) as SaveRequest
    const sourceText = body.sourceText?.trim()
    const translationVi = body.translationVi?.trim()

    if (!sourceText || !translationVi) {
      return errorResponse(400, "Thiếu dữ liệu cần lưu.", {
        sourceText: sourceText ? "" : "missing",
        translationVi: translationVi ? "" : "missing",
      })
    }

    if (role !== "ADMIN") {
      const settings = await getAppLimitSettings()
      const currentCount = await prisma.translationHistory.count({
        where: { userId },
      })

      if (currentCount >= settings.savedTranslationLimit) {
        return NextResponse.json(
          {
            error: {
              code: "LIMIT_REACHED",
              message: `Bạn chỉ có thể lưu tối đa ${settings.savedTranslationLimit} bản dịch.`,
            },
          },
          { status: 409 }
        )
      }
    }

    const saved = await prisma.translationHistory.create({
      data: {
        direction: body.direction ?? "JP_TO_VI",
        userId,
        sourceText,
        kanaReading: body.kanaReading?.trim() || null,
        romaji: body.romaji?.trim() || null,
        translationVi,
        jlptLevel: body.jlptLevel ?? null,
        translationStyle: body.translationStyle ?? null,
        grammarJson:
          body.grammarPoints == null
            ? undefined
            : (body.grammarPoints as Prisma.InputJsonValue),
        kanjiJson:
          body.kanjiExplanations == null
            ? undefined
            : (body.kanjiExplanations as Prisma.InputJsonValue),
        ocrText: body.ocrText?.trim() || null,
        notes: body.notes == null ? undefined : (body.notes as Prisma.InputJsonValue),
      },
      select: { id: true, createdAt: true },
    })

    return NextResponse.json({ data: saved })
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
