import { prisma } from "@/lib/prisma"

export const SETTING_KEYS = [
  "savedTranslationLimit",
  "grammarDailyLimit",
  "maxConversationParticipants",
] as const
export type SettingKey = (typeof SETTING_KEYS)[number]

export type AppLimitSettings = Record<SettingKey, number>

const DEFAULT_SETTINGS: AppLimitSettings = {
  savedTranslationLimit: Number(process.env.SAVED_TRANSLATION_LIMIT ?? 10),
  grammarDailyLimit: Number(process.env.GRAMMAR_DAILY_LIMIT ?? 10),
  maxConversationParticipants: Number(process.env.MAX_CONVERSATION_PARTICIPANTS ?? 5),
}

const toPositiveInteger = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(1, Math.floor(parsed))
}

export async function getAppLimitSettings(): Promise<AppLimitSettings> {
  const rows = await prisma.appSetting.findMany({
    where: { key: { in: [...SETTING_KEYS] } },
  })

  const settings = { ...DEFAULT_SETTINGS }
  for (const row of rows) {
    if (
      row.key === "savedTranslationLimit" ||
      row.key === "grammarDailyLimit" ||
      row.key === "maxConversationParticipants"
    ) {
      settings[row.key] = toPositiveInteger(row.value, DEFAULT_SETTINGS[row.key])
    }
  }

  return settings
}

export async function updateAppLimitSettings(input: Partial<AppLimitSettings>) {
  const next: Partial<AppLimitSettings> = {}

  for (const key of SETTING_KEYS) {
    if (input[key] != null) {
      next[key] = toPositiveInteger(input[key], DEFAULT_SETTINGS[key])
    }
  }

  await prisma.$transaction(
    Object.entries(next).map(([key, value]) =>
      prisma.appSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  )

  return getAppLimitSettings()
}
