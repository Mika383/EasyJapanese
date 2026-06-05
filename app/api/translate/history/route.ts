import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET() {
  try {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Vui lòng đăng nhập để xem lịch sử." } },
        { status: 401 }
      )
    }

    const history = await prisma.translationHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        direction: true,
        sourceText: true,
        translationVi: true,
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
