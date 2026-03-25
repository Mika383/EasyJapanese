"use client"

import { useState, useTransition } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { AddNotePanel } from "@/components/notes/add-note-panel"
import { NotesList } from "@/components/notes/notes-list"
import type { NoteListItem } from "@/app/notes/actions"
import { deleteNote, updateNote } from "@/app/notes/actions"

interface NotesClientProps {
  initialNotes: NoteListItem[]
  serverError?: string | null
}

export function NotesClient({ initialNotes, serverError }: NotesClientProps) {
  const [notes, setNotes] = useState<NoteListItem[]>(initialNotes)
  const [isAdding, setIsAdding] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleCreated = (note: NoteListItem) => {
    setNotes((prev) => [note, ...prev])
    setIsAdding(false)
  }

  const handleUpdate = (id: string, title: string, content: string) => {
    startTransition(async () => {
      const toastId = `note-update-${id}`
      toast.loading("Đang cập nhật ghi chú...", { id: toastId })
      try {
        const updated = await updateNote(id, title, content)
        setNotes((prev) => prev.map((note) => (note.id === id ? updated : note)))
        toast.success("Đã cập nhật ghi chú.", { id: toastId })
      } catch (error) {
        console.error(error)
        toast.error("Không thể cập nhật ghi chú.", { id: toastId })
      }
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const toastId = `note-delete-${id}`
      toast.loading("Đang xóa ghi chú...", { id: toastId })
      try {
        await deleteNote(id)
        setNotes((prev) => prev.filter((note) => note.id !== id))
        toast.success("Đã xóa ghi chú.", { id: toastId })
      } catch (error) {
        console.error(error)
        toast.error("Không thể xóa ghi chú.", { id: toastId })
      }
    })
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <header className="mb-16 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Ghi chú của tôi</h1>
          <p className="text-muted-foreground font-serif italic text-lg">&quot;Bút sa gà chết, lời nói giáo đầu.&quot;</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold border-2 border-primary hover:bg-background hover:text-primary transition-all"
          >
            <Plus className="h-5 w-5" />
            THÊM GHI CHÚ
          </button>
        )}
      </header>

      {serverError && (
        <div className="mb-8 border-2 border-destructive/40 bg-destructive/5 p-6 text-sm font-semibold text-destructive">
          {serverError}
        </div>
      )}

      {isAdding && (
        <AddNotePanel
          onCancel={() => setIsAdding(false)}
          onCreated={handleCreated}
          isPending={isPending}
        />
      )}

      <NotesList
        notes={notes}
        isPending={isPending}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  )
}
