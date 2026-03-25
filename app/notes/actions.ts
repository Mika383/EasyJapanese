"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
type PrismaNoteType = "GRAMMAR" | "VOCAB"
type PrismaWordScriptType = "KANJI" | "HIRAGANA" | "KATAKANA"
type PrismaPartOfSpeech =
  | "NOUN"
  | "VERB"
  | "ADJECTIVE"
  | "ADVERB"
  | "CONJUNCTION"
  | "PREPOSITION"
  | "OTHER"

export type NoteListItem = {
  id: string
  title: string
  content: string
  updatedAt: number
}

type GrammarInput = {
  title: string
  formula: string
  usage: string
  examples: Array<{ jp: string; meaning: string }>
}

type VocabInput = {
  scriptType: "kanji" | "hira" | "kata"
  partOfSpeech: string
  kanji?: string
  reading?: string
  hira?: string
  kata?: string
  meaning?: string
}

async function requireUserId() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error("Chưa đăng nhập.")
  return userId
}

async function getUserIdOrNull() {
  const session = await auth()
  return session?.user?.id ?? null
}

export async function getNotes(): Promise<NoteListItem[]> {
  const userId = await getUserIdOrNull()
  if (!userId) return []
  const notes = await prisma.note.findMany({
    where: { userId, deletedAt: null },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, content: true, updatedAt: true },
  })
  return notes.map((note) => ({ ...note, updatedAt: note.updatedAt.getTime() }))
}

export async function createGrammarNote(input: GrammarInput): Promise<NoteListItem> {
  const userId = await requireUserId()
  const examples = input.examples.filter((ex) => ex.jp.trim() || ex.meaning.trim())
  const grammarTitle = input.title.trim()
  const title = `Ngữ pháp: ${grammarTitle || input.formula.trim() || "Chưa có công thức"}`
  const contentLines = [
    `Tiêu đề: ${grammarTitle || "-"}`,
    `Công thức: ${input.formula || "-"}`,
    `Mục đích: ${input.usage || "-"}`,
    `Ví dụ:`,
    ...(examples.length
      ? examples.map((ex) => `- ${ex.jp || "-"} | Nghĩa: ${ex.meaning || "-"}`)
      : ["-"]),
  ]

  const note = await prisma.note.create({
    data: {
      userId,
      type: "GRAMMAR" as PrismaNoteType,
      title,
      content: contentLines.join("\n"),
      grammar: {
        create: {
          title: grammarTitle || "Chưa đặt tên",
          formula: input.formula || "",
          usage: input.usage || "",
          examples: {
            create: examples.map((ex) => ({
              jp: ex.jp || "",
              meaning: ex.meaning || "",
            })),
          },
        },
      },
    },
    select: { id: true, title: true, content: true, updatedAt: true },
  })

  revalidatePath("/notes")
  return { ...note, updatedAt: note.updatedAt.getTime() }
}

function mapScriptType(scriptType: VocabInput["scriptType"]): PrismaWordScriptType {
  if (scriptType === "kanji") return "KANJI"
  if (scriptType === "hira") return "HIRAGANA"
  return "KATAKANA"
}

function mapPartOfSpeech(value: string): PrismaPartOfSpeech {
  switch (value) {
    case "Danh từ":
      return "NOUN"
    case "Động từ":
      return "VERB"
    case "Tính từ":
      return "ADJECTIVE"
    case "Trạng từ":
      return "ADVERB"
    case "Liên từ":
      return "CONJUNCTION"
    case "Giới từ":
      return "PREPOSITION"
    default:
      return "OTHER"
  }
}

export async function createVocabNote(input: VocabInput): Promise<NoteListItem> {
  const userId = await requireUserId()
  const scriptLabel =
    input.scriptType === "kanji"
      ? "Kanji"
      : input.scriptType === "hira"
      ? "Hiragana"
      : "Katakana"

  const title =
    input.scriptType === "kanji"
      ? `Từ vựng: ${input.kanji?.trim() || "Chưa có kanji"}`
      : input.scriptType === "hira"
      ? `Từ vựng: ${input.hira?.trim() || "Chưa có từ"}`
      : `Từ vựng: ${input.kata?.trim() || "Chưa có từ"}`

  const contentLines = [
    `Loại chữ: ${scriptLabel}`,
    `Từ loại: ${input.partOfSpeech || "-"}`,
  ]

  if (input.scriptType === "kanji") {
    contentLines.push(`Kanji: ${input.kanji || "-"}`)
    contentLines.push(`Hiragana: ${input.reading || "-"}`)
    contentLines.push(`Nghĩa: ${input.meaning || "-"}`)
  }

  if (input.scriptType === "hira") {
    contentLines.push(`Hiragana: ${input.hira || "-"}`)
    contentLines.push(`Nghĩa: ${input.meaning || "-"}`)
  }

  if (input.scriptType === "kata") {
    contentLines.push(`Katakana: ${input.kata || "-"}`)
    contentLines.push(`Nghĩa: ${input.meaning || "-"}`)
  }

  const note = await prisma.note.create({
    data: {
      userId,
      type: "VOCAB" as PrismaNoteType,
      title,
      content: contentLines.join("\n"),
      vocab: {
        create: {
          scriptType: mapScriptType(input.scriptType),
          partOfSpeech: mapPartOfSpeech(input.partOfSpeech),
          kanji: input.kanji || null,
          reading: input.reading || null,
          hiragana: input.hira || null,
          katakana: input.kata || null,
          meaning: input.meaning || "",
        },
      },
    },
    select: { id: true, title: true, content: true, updatedAt: true },
  })

  revalidatePath("/notes")
  return { ...note, updatedAt: note.updatedAt.getTime() }
}

export async function updateNote(id: string, title: string, content: string): Promise<NoteListItem> {
  const userId = await requireUserId()
  const result = await prisma.note.updateMany({
    where: { id, userId, deletedAt: null },
    data: { title, content },
  })

  if (result.count === 0) {
    throw new Error("Không tìm thấy ghi chú.")
  }

  const note = await prisma.note.findFirst({
    where: { id, userId },
    select: { id: true, title: true, content: true, updatedAt: true },
  })

  if (!note) {
    throw new Error("Không tìm thấy ghi chú.")
  }

  revalidatePath("/notes")
  return { ...note, updatedAt: note.updatedAt.getTime() }
}

export async function deleteNote(id: string): Promise<{ id: string }> {
  const userId = await requireUserId()
  const result = await prisma.note.updateMany({
    where: { id, userId, deletedAt: null },
    data: { deletedAt: new Date() },
  })

  if (result.count === 0) {
    throw new Error("Không tìm thấy ghi chú.")
  }

  revalidatePath("/notes")
  return { id }
}
