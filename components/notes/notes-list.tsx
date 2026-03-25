"use client"

import { useState } from "react"
import { Edit3, Save, Trash2, X } from "lucide-react"
import type { NoteListItem } from "@/app/notes/actions"

interface NotesListProps {
  notes: NoteListItem[]
  onUpdate: (id: string, title: string, content: string) => void
  onDelete: (id: string) => void
  isPending?: boolean
}

export function NotesList({ notes, onUpdate, onDelete, isPending }: NotesListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNote, setEditNote] = useState({ title: "", content: "" })

  const startEdit = (note: NoteListItem) => {
    setEditingId(note.id)
    setEditNote({ title: note.title, content: note.content })
  }

  return (
    <div className="grid gap-8">
      {notes.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-foreground/10">
          <p className="text-muted-foreground font-serif italic mb-2">Chưa có ghi chú nào được tạo.</p>
          <p className="text-sm font-bold opacity-50 uppercase tracking-widest">Hãy bắt đầu ghi lại kiến thức của bạn.</p>
        </div>
      )}

      {[...notes].map((note) => (
        <div key={note.id} className="group border-2 border-foreground/5 p-8 transition-all hover:border-primary/30 hover:bg-primary/5">
          {editingId === note.id ? (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                className="text-xl font-bold bg-transparent border-b border-foreground/10 pb-2 focus:outline-none focus:border-primary"
                value={editNote.title}
                onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
              />
              <textarea
                className="w-full h-32 bg-transparent focus:outline-none resize-none font-serif"
                value={editNote.content}
                onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setEditingId(null)}
                  className="p-2 border hover:bg-background"
                  disabled={isPending}
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    onUpdate(note.id, editNote.title, editNote.content)
                    setEditingId(null)
                  }}
                  className="p-2 bg-primary text-primary-foreground"
                  disabled={isPending}
                >
                  <Save className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-black uppercase tracking-tight">{note.title || "Không có tiêu đề"}</h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(note)}
                    className="p-2 hover:bg-foreground hover:text-background transition-colors"
                    disabled={isPending}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(note.id)}
                    className="p-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-muted-foreground whitespace-pre-wrap font-serif leading-relaxed italic">{note.content}</p>
              <div className="mt-6 pt-4 border-t border-foreground/5 flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  Cập nhật: {new Date(note.updatedAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
