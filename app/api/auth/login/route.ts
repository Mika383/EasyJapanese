import { NextResponse } from "next/server"
import { z } from "zod"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ message: "Dữ liệu không hợp lệ." }, { status: 400 })
    }

    const email = parsed.data.email.toLowerCase()
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user?.passwordHash) {
      return NextResponse.json({ message: "Email hoặc mật khẩu không đúng." }, { status: 401 })
    }

    const isValid = await compare(parsed.data.password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ message: "Email hoặc mật khẩu không đúng." }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Có lỗi xảy ra." }, { status: 500 })
  }
}
