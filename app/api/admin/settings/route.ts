import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { getAppLimitSettings, updateAppLimitSettings } from "@/lib/app-settings"

export const runtime = "nodejs"

const settingsSchema = z.object({
  savedTranslationLimit: z.coerce.number().int().min(1).max(1000),
  grammarDailyLimit: z.coerce.number().int().min(1).max(1000),
  maxConversationParticipants: z.coerce.number().int().min(2).max(20),
})

const requireAdmin = async () => {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "UNAUTHORIZED" as const }
  }
  if (session.user.role !== "ADMIN") {
    return { error: "FORBIDDEN" as const }
  }
  return { session }
}

export async function GET() {
  try {
    const admin = await requireAdmin()
    if ("error" in admin) {
      return NextResponse.json(
        {
          error: {
            code: admin.error,
            message: admin.error === "UNAUTHORIZED" ? "Vui lòng đăng nhập." : "Bạn không có quyền truy cập.",
          },
        },
        { status: admin.error === "UNAUTHORIZED" ? 401 : 403 }
      )
    }

    const settings = await getAppLimitSettings()
    return NextResponse.json({ data: settings })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi."
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message } }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireAdmin()
    if ("error" in admin) {
      return NextResponse.json(
        {
          error: {
            code: admin.error,
            message: admin.error === "UNAUTHORIZED" ? "Vui lòng đăng nhập." : "Bạn không có quyền truy cập.",
          },
        },
        { status: admin.error === "UNAUTHORIZED" ? 401 : 403 }
      )
    }

    const body = await req.json()
    const parsed = settingsSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Thông số không hợp lệ. Số nhân vật hội thoại phải từ 2 đến 20.",
          },
        },
        { status: 400 }
      )
    }

    const settings = await updateAppLimitSettings(parsed.data)
    return NextResponse.json({ data: settings })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi."
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message } }, { status: 500 })
  }
}
