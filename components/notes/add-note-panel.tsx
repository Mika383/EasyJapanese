"use client"

import { useMemo, useState, useTransition } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"
import { createGrammarNote, createVocabNote } from "@/app/notes/actions"
import type { NoteListItem } from "@/app/notes/actions"

type NoteType = "grammar" | "vocab" | ""

type ScriptType = "kanji" | "hira" | "kata" | ""

interface AddNotePanelProps {
  onCancel: () => void
  onCreated: (note: NoteListItem) => void
  isPending?: boolean
}

export function AddNotePanel({ onCancel, onCreated, isPending }: AddNotePanelProps) {
  const [noteType, setNoteType] = useState<NoteType>("")
  const [grammarNote, setGrammarNote] = useState({
    title: "",
    formula: "",
    usage: "",
    examples: [{ jp: "", meaning: "" }],
  })
  const [vocabNote, setVocabNote] = useState({
    scriptType: "" as ScriptType,
    partOfSpeech: "",
    kanji: "",
    reading: "",
    hira: "",
    kata: "",
    meaning: "",
  })
  const [isSubmitting, startTransition] = useTransition()

  const canSubmit = useMemo(() => {
    if (noteType === "grammar") {
      return (
        grammarNote.title.trim() ||
        grammarNote.formula.trim() ||
        grammarNote.usage.trim() ||
        grammarNote.examples.some((ex) => ex.jp.trim() || ex.meaning.trim())
      )
    }
    if (noteType === "vocab") {
      if (vocabNote.scriptType === "kanji") {
        return vocabNote.kanji.trim() || vocabNote.reading.trim() || vocabNote.meaning.trim()
      }
      if (vocabNote.scriptType === "hira") {
        return vocabNote.hira.trim() || vocabNote.meaning.trim()
      }
      if (vocabNote.scriptType === "kata") {
        return vocabNote.kata.trim() || vocabNote.meaning.trim()
      }
    }
    return false
  }, [grammarNote, noteType, vocabNote])

  const handleSave = () => {
    if (!noteType) {
      toast.error("Vui lòng chọn loại ghi chú.")
      return
    }

    startTransition(async () => {
      const toastId = "note-create"
      toast.loading("Đang lưu ghi chú...", { id: toastId })
      try {
        if (noteType === "grammar") {
          const note = await createGrammarNote({
            title: grammarNote.title,
            formula: grammarNote.formula,
            usage: grammarNote.usage,
            examples: grammarNote.examples,
          })
          onCreated(note)
        }

        if (noteType === "vocab" && vocabNote.scriptType) {
          const note = await createVocabNote({
            scriptType: vocabNote.scriptType,
            partOfSpeech: vocabNote.partOfSpeech,
            kanji: vocabNote.kanji,
            reading: vocabNote.reading,
            hira: vocabNote.hira,
            kata: vocabNote.kata,
            meaning: vocabNote.meaning,
          })
          onCreated(note)
        }

        if (noteType === "vocab" && !vocabNote.scriptType) {
          toast.error("Vui lòng chọn loại chữ.", { id: toastId })
          return
        }

        toast.success("Đã lưu ghi chú.", { id: toastId })
      } catch (error) {
        console.error(error)
        toast.error("Không thể lưu ghi chú.", { id: toastId })
      }
    })
  }

  return (
    <div className="mb-12 border-4 border-primary/20 p-8 bg-background relative character-grid-animation">
      <div className="mb-8">
        <label className="text-xs font-black uppercase tracking-[0.25em] text-primary">Loại ghi chú</label>
        <select
          className="mt-3 w-full border-2 border-foreground/10 bg-transparent px-4 py-3 text-lg font-bold focus:outline-none focus:border-primary transition-colors"
          value={noteType}
          onChange={(e) => setNoteType(e.target.value as NoteType)}
        >
          <option value="" disabled>Chọn loại ghi chú</option>
          <option value="vocab">Từ vựng</option>
          <option value="grammar">Ngữ pháp</option>
        </select>
      </div>

      {noteType === "grammar" && (
        <div className="space-y-6">
          <div className="grid gap-2">
            <label className="text-sm font-bold uppercase tracking-widest">Tiêu đề ngữ pháp</label>
            <input
              type="text"
              placeholder="Ví dụ: 〜たい (muốn làm gì)"
              className="w-full text-lg font-bold bg-transparent border-b-2 border-foreground/10 pb-3 focus:outline-none focus:border-primary transition-colors"
              value={grammarNote.title}
              onChange={(e) => setGrammarNote({ ...grammarNote, title: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-bold uppercase tracking-widest">Công thức</label>
            <input
              type="text"
              placeholder="Ví dụ: N1 は N2 です"
              className="w-full text-lg font-bold bg-transparent border-b-2 border-foreground/10 pb-3 focus:outline-none focus:border-primary transition-colors"
              value={grammarNote.formula}
              onChange={(e) => setGrammarNote({ ...grammarNote, formula: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-bold uppercase tracking-widest">Mục đích</label>
            <textarea
              placeholder="Mô tả công thức dùng để làm gì"
              className="w-full h-28 bg-transparent text-lg focus:outline-none resize-none font-serif leading-relaxed"
              value={grammarNote.usage}
              onChange={(e) => setGrammarNote({ ...grammarNote, usage: e.target.value })}
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold uppercase tracking-widest">Ví dụ</label>
              <button
                type="button"
                className="px-3 py-1 border-2 border-foreground/20 text-xs font-bold uppercase tracking-widest hover:border-primary"
                onClick={() => setGrammarNote({ ...grammarNote, examples: [...grammarNote.examples, { jp: "", meaning: "" }] })}
              >
                Thêm ví dụ
              </button>
            </div>
            <div className="grid gap-3">
              {grammarNote.examples.map((example, index) => (
                <div key={`${example.jp}-${example.meaning}-${index}`} className="grid gap-3 border-2 border-foreground/10 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Ví dụ {index + 1}
                    </p>
                    {grammarNote.examples.length > 1 && (
                      <button
                        type="button"
                        className="p-2 border-2 border-foreground/10 hover:border-primary"
                        onClick={() => {
                          const next = grammarNote.examples.filter((_, idx) => idx !== index)
                          setGrammarNote({ ...grammarNote, examples: next.length ? next : [{ jp: "", meaning: "" }] })
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Câu ví dụ (JP)"
                    className="w-full text-base bg-transparent border-2 border-foreground/10 px-3 py-2 focus:outline-none focus:border-primary transition-colors"
                    value={example.jp}
                    onChange={(e) => {
                      const next = [...grammarNote.examples]
                      next[index] = { ...next[index], jp: e.target.value }
                      setGrammarNote({ ...grammarNote, examples: next })
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Nghĩa của ví dụ"
                    className="w-full text-base bg-transparent border-2 border-foreground/10 px-3 py-2 focus:outline-none focus:border-primary transition-colors"
                    value={example.meaning}
                    onChange={(e) => {
                      const next = [...grammarNote.examples]
                      next[index] = { ...next[index], meaning: e.target.value }
                      setGrammarNote({ ...grammarNote, examples: next })
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {noteType === "vocab" && (
        <div className="space-y-6">
          <div className="grid gap-2">
            <label className="text-sm font-bold uppercase tracking-widest">Loại chữ</label>
            <select
              className="w-full border-2 border-foreground/10 bg-transparent px-4 py-3 text-lg font-bold focus:outline-none focus:border-primary transition-colors"
              value={vocabNote.scriptType}
              onChange={(e) =>
                setVocabNote({
                  ...vocabNote,
                  scriptType: e.target.value as ScriptType,
                  kanji: "",
                  reading: "",
                  hira: "",
                  kata: "",
                  meaning: "",
                })
              }
            >
              <option value="" disabled>Chọn loại chữ</option>
              <option value="kanji">Kanji</option>
              <option value="hira">Hiragana</option>
              <option value="kata">Katakana</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold uppercase tracking-widest">Từ loại</label>
            <select
              className="w-full border-2 border-foreground/10 bg-transparent px-4 py-3 text-lg font-bold focus:outline-none focus:border-primary transition-colors"
              value={vocabNote.partOfSpeech}
              onChange={(e) => setVocabNote({ ...vocabNote, partOfSpeech: e.target.value })}
            >
              <option value="" disabled>Chọn từ loại</option>
              <option value="Danh từ">Danh từ</option>
              <option value="Động từ">Động từ</option>
              <option value="Tính từ">Tính từ</option>
              <option value="Trạng từ">Trạng từ</option>
              <option value="Liên từ">Liên từ</option>
              <option value="Giới từ">Giới từ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          {vocabNote.scriptType === "kanji" && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-bold uppercase tracking-widest">Kanji</label>
                <input
                  type="text"
                  placeholder="漢字"
                  className="w-full text-lg font-bold bg-transparent border-b-2 border-foreground/10 pb-3 focus:outline-none focus:border-primary transition-colors"
                  value={vocabNote.kanji}
                  onChange={(e) => setVocabNote({ ...vocabNote, kanji: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-bold uppercase tracking-widest">Hiragana</label>
                <input
                  type="text"
                  placeholder="ひらがな"
                  className="w-full text-lg bg-transparent border-b-2 border-foreground/10 pb-3 focus:outline-none focus:border-primary transition-colors"
                  value={vocabNote.reading}
                  onChange={(e) => setVocabNote({ ...vocabNote, reading: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-bold uppercase tracking-widest">Nghĩa</label>
                <input
                  type="text"
                  placeholder="Ý nghĩa tiếng Việt"
                  className="w-full text-lg bg-transparent border-b-2 border-foreground/10 pb-3 focus:outline-none focus:border-primary transition-colors"
                  value={vocabNote.meaning}
                  onChange={(e) => setVocabNote({ ...vocabNote, meaning: e.target.value })}
                />
              </div>
            </div>
          )}

          {vocabNote.scriptType === "hira" && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-bold uppercase tracking-widest">Hiragana</label>
                <input
                  type="text"
                  placeholder="ひらがな"
                  className="w-full text-lg font-bold bg-transparent border-b-2 border-foreground/10 pb-3 focus:outline-none focus:border-primary transition-colors"
                  value={vocabNote.hira}
                  onChange={(e) => setVocabNote({ ...vocabNote, hira: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-bold uppercase tracking-widest">Nghĩa</label>
                <input
                  type="text"
                  placeholder="Ý nghĩa tiếng Việt"
                  className="w-full text-lg bg-transparent border-b-2 border-foreground/10 pb-3 focus:outline-none focus:border-primary transition-colors"
                  value={vocabNote.meaning}
                  onChange={(e) => setVocabNote({ ...vocabNote, meaning: e.target.value })}
                />
              </div>
            </div>
          )}

          {vocabNote.scriptType === "kata" && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-bold uppercase tracking-widest">Katakana</label>
                <input
                  type="text"
                  placeholder="カタカナ"
                  className="w-full text-lg font-bold bg-transparent border-b-2 border-foreground/10 pb-3 focus:outline-none focus:border-primary transition-colors"
                  value={vocabNote.kata}
                  onChange={(e) => setVocabNote({ ...vocabNote, kata: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-bold uppercase tracking-widest">Nghĩa</label>
                <input
                  type="text"
                  placeholder="Ý nghĩa tiếng Việt"
                  className="w-full text-lg bg-transparent border-b-2 border-foreground/10 pb-3 focus:outline-none focus:border-primary transition-colors"
                  value={vocabNote.meaning}
                  onChange={(e) => setVocabNote({ ...vocabNote, meaning: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={onCancel}
          className="px-6 py-2 font-bold hover:text-primary transition-colors"
          disabled={isSubmitting || isPending}
        >
          HỦY
        </button>
        <button
          onClick={handleSave}
          disabled={!canSubmit || isSubmitting || isPending}
          className="px-8 py-2 bg-primary text-primary-foreground font-black tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "ĐANG LƯU" : "LƯU LẠI"}
        </button>
      </div>
    </div>
  )
}
