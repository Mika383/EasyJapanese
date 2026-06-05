import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getAppLimitSettings } from "@/lib/app-settings"

export const runtime = "nodejs"

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

export async function GET() {
  try {
    const session = await auth()
    const userId = session?.user?.id
    const role = session?.user?.role ?? "STUDENT"
    if (!userId) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Vui lòng đăng nhập để xem lượt sử dụng." } },
        { status: 401 }
      )
    }

    const settings = await getAppLimitSettings()
    const savedCount = await prisma.translationHistory.count({ where: { userId } })

    if (role === "ADMIN") {
      return NextResponse.json({
        data: {
          saved: { count: savedCount, limit: null },
          grammar: { used: 0, limit: null, remaining: null },
        },
      })
    }

    if (role !== "STUDENT") {
      return NextResponse.json({
        data: {
          saved: { count: savedCount, limit: settings.savedTranslationLimit },
          grammar: { used: 0, limit: null, remaining: null },
        },
      })
    }

    const usageModel = (prisma as unknown as {
      grammarExplainUsage?: {
        findUnique: (args: {
          where: { userId_periodStart: { userId: string; periodStart: Date } }
          select: { count: true }
        }) => Promise<{ count: number } | null>
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
      select: { count: true },
    })
    const used = usage?.count ?? 0
    const remaining = Math.max(settings.grammarDailyLimit - used, 0)
    const periodEnd = new Date(periodStart.getTime() + 24 * 60 * 60 * 1000)

    return NextResponse.json({
      data: {
        saved: { count: savedCount, limit: settings.savedTranslationLimit },
        grammar: {
          used,
          limit: settings.grammarDailyLimit,
          remaining,
          periodStart: periodStart.toISOString(),
          periodEnd: periodEnd.toISOString(),
        },
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
