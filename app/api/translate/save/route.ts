import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export const runtime = "nodejs"

type SaveRequest = {
  sourceText: string
  kanaReading?: string
  romaji?: string
  translationVi: string
  grammarPoints?: unknown
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

    const currentCount = await prisma.translationHistory.count({
      where: { userId },
    })

    if (currentCount >= 10) {
      return NextResponse.json(
        {
          error: {
            code: "LIMIT_REACHED",
            message: "Bạn chỉ có thể lưu tối đa 10 bản dịch.",
          },
        },
        { status: 409 }
      )
    }

    const saved = await prisma.translationHistory.create({
      data: {
        userId,
        sourceText,
        kanaReading: body.kanaReading?.trim() || null,
        romaji: body.romaji?.trim() || null,
        translationVi,
        grammarJson:
          body.grammarPoints == null
            ? undefined
            : (body.grammarPoints as Prisma.InputJsonValue),
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
