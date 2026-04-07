import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Vui lòng đăng nhập để xem chi tiết." } },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const item = await prisma.translationHistory.findFirst({
      where: { id, userId },
      select: {
        id: true,
        sourceText: true,
        kanaReading: true,
        romaji: true,
        translationText: true,
        sourceLang: true,
        targetLang: true,
        grammarJson: true,
        ocrText: true,
        notes: true,
        createdAt: true,
      },
    })

    if (!item) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Không tìm thấy bản dịch." } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: {
        id: item.id,
        sourceText: item.sourceText,
        kanaReading: item.kanaReading,
        romaji: item.romaji,
        translationText: item.translationText,
        sourceLang: item.sourceLang,
        targetLang: item.targetLang,
        grammarPoints: Array.isArray(item.grammarJson) ? item.grammarJson : [],
        ocrText: item.ocrText,
        notes: Array.isArray(item.notes) ? item.notes : [],
        createdAt: item.createdAt.toISOString(),
      },
    })
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

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Vui lòng đăng nhập để xoá." } },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const existing = await prisma.translationHistory.findFirst({
      where: { id, userId },
      select: { id: true },
    })

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Không tìm thấy bản dịch." } },
        { status: 404 }
      )
    }

    await prisma.translationHistory.delete({ where: { id } })
    return NextResponse.json({ data: { id } })
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
