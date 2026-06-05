import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { z } from "zod"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { JLPT_LEVELS, TRANSLATION_DIRECTIONS, TRANSLATION_STYLES } from "@/lib/translate-types"

export const runtime = "nodejs"

const saveSchema = z.object({
  title: z.string().trim().optional(),
  direction: z.enum(TRANSLATION_DIRECTIONS),
  participants: z.array(z.object({ id: z.string(), name: z.string() })).min(2),
  lines: z.array(z.object({ id: z.string(), speakerId: z.string(), text: z.string() })).min(1),
  result: z.unknown(),
  jlptLevel: z.enum(JLPT_LEVELS).optional(),
  translationStyle: z.enum(TRANSLATION_STYLES).optional(),
})

export async function GET() {
  try {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Vui lòng đăng nhập." } }, { status: 401 })
    }

    const history = await prisma.conversationTranslationHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        direction: true,
        jlptLevel: true,
        translationStyle: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      data: history.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi."
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message } }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Vui lòng đăng nhập để lưu." } }, { status: 401 })
    }

    const body = await req.json()
    const parsed = saveSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Dữ liệu lưu hội thoại không hợp lệ." } },
        { status: 400 }
      )
    }

    const saved = await prisma.conversationTranslationHistory.create({
      data: {
        userId,
        title: parsed.data.title || null,
        direction: parsed.data.direction,
        participantsJson: parsed.data.participants as Prisma.InputJsonValue,
        linesJson: parsed.data.lines as Prisma.InputJsonValue,
        resultJson: parsed.data.result as Prisma.InputJsonValue,
        jlptLevel: parsed.data.jlptLevel ?? null,
        translationStyle: parsed.data.translationStyle ?? null,
      },
      select: { id: true, createdAt: true },
    })

    return NextResponse.json({ data: saved })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi."
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message } }, { status: 500 })
  }
}

