export const TRANSLATION_DIRECTIONS = ["JP_TO_VI", "VI_TO_JP"] as const
export type TranslationDirection = (typeof TRANSLATION_DIRECTIONS)[number]

export const JLPT_LEVELS = ["N5", "N4", "N3", "N2", "N1"] as const
export type JlptLevel = (typeof JLPT_LEVELS)[number]

export const TRANSLATION_STYLES = ["SPOKEN", "STRUCTURED"] as const
export type TranslationStyle = (typeof TRANSLATION_STYLES)[number]

export const TRANSLATION_WORKFLOWS = ["single", "conversation"] as const
export type TranslationWorkflow = (typeof TRANSLATION_WORKFLOWS)[number]

export type ConversationParticipant = {
  id: string
  name: string
}

export type ConversationLineInput = {
  id: string
  speakerId: string
  text: string
}

export type ConversationTranslatedLine = ConversationLineInput & {
  speakerName: string
  translatedText: string
  kanaReading?: string
  grammarNotes?: string[]
  contextNotes?: string[]
}

export type ConversationTranslationResult = {
  direction: TranslationDirection
  participants: ConversationParticipant[]
  lines: ConversationTranslatedLine[]
  wholeSummary: string
  participantSummaries: Array<{
    participantId: string
    participantName: string
    summary: string
  }>
  grammarAnalysis: string[]
  contextAnalysis: string[]
  jlptLevel?: JlptLevel
  translationStyle?: TranslationStyle
}

export const directionLabels: Record<TranslationDirection, string> = {
  JP_TO_VI: "Nhật -> Việt",
  VI_TO_JP: "Việt -> Nhật",
}

export const sourceLanguageLabels: Record<TranslationDirection, string> = {
  JP_TO_VI: "Tiếng Nhật",
  VI_TO_JP: "Tiếng Việt",
}

export const targetLanguageLabels: Record<TranslationDirection, string> = {
  JP_TO_VI: "Tiếng Việt",
  VI_TO_JP: "Tiếng Nhật",
}

export const styleLabels: Record<TranslationStyle, string> = {
  SPOKEN: "Văn nói",
  STRUCTURED: "Đúng cấu trúc",
}
