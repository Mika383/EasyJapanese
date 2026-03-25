import { NextResponse } from "next/server"
import { z } from "zod"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(100),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ message: "Dữ liệu không hợp lệ." }, { status: 400 })
    }

    const email = parsed.data.email.toLowerCase()
    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing) {
      return NextResponse.json({ message: "Email đã được sử dụng." }, { status: 409 })
    }

    const passwordHash = await hash(parsed.data.password, 10)

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash,
      },
      select: { id: true, name: true, email: true },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Có lỗi xảy ra." }, { status: 500 })
  }
}
