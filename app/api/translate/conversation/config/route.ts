import { NextResponse } from "next/server"
import { getAppLimitSettings } from "@/lib/app-settings"

export const runtime = "nodejs"

export async function GET() {
  try {
    const settings = await getAppLimitSettings()
    return NextResponse.json({
      data: {
        minParticipants: 2,
        maxParticipants: settings.maxConversationParticipants,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi."
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message } }, { status: 500 })
  }
}

