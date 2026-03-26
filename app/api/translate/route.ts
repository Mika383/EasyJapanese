import { NextResponse } from "next/server"
import { generateTranslation } from "@/lib/gemini"

export const runtime = "nodejs"

type TranslateRequest = {
  text?: string
  image?: {
    data: string
    mimeType: string
  }
  includeGrammar?: boolean
  includeKana?: boolean
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
    const body = (await req.json()) as TranslateRequest
    const text = body.text?.trim()
    const image = body.image
    const includeGrammar = body.includeGrammar ?? false
    const includeKana = body.includeKana ?? true

    if (!text && !image) {
      return errorResponse(400, "Vui lòng nhập văn bản hoặc tải ảnh.", {
        text: "missing",
        image: "missing",
      })
    }

    const result = await generateTranslation({
      text: text || undefined,
      image: image?.data ? image : undefined,
      includeGrammar,
      includeKana,
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
