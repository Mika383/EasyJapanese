"use client"

import { useState } from "react"
import { useNotesStore, Note } from "@/store/use-notes-store"
import { Plus, Trash2, Edit3, Save, X } from "lucide-react"

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useNotesStore()
  const [isAdding, setIsAdding] = useState(false)
  const [newNote, setNewNote] = useState({ title: "", content: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNote, setEditNote] = useState({ title: "", content: "" })

  const handleAdd = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      addNote(newNote)
      setNewNote({ title: "", content: "" })
      setIsAdding(false)
    }
  }

  const startEdit = (note: Note) => {
    setEditingId(note.id)
    setEditNote({ title: note.title, content: note.content })
  }

  const handleUpdate = (id: string) => {
    updateNote(id, editNote)
    setEditingId(null)
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

      {isAdding && (
        <div className="mb-12 border-4 border-primary/20 p-8 bg-background relative character-grid-animation">
          <input
            type="text"
            placeholder="Tiêu đề..."
            className="w-full text-2xl font-bold bg-transparent border-b-2 border-foreground/10 pb-4 mb-6 focus:outline-none focus:border-primary transition-colors"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          <textarea
            placeholder="Nội dung ghi chú..."
            className="w-full h-40 bg-transparent text-lg focus:outline-none resize-none font-serif leading-relaxed"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          />
          <div className="flex justify-end gap-4 mt-8">
            <button onClick={() => setIsAdding(false)} className="px-6 py-2 font-bold hover:text-primary transition-colors">HỦY</button>
            <button 
              onClick={handleAdd}
              className="px-8 py-2 bg-primary text-primary-foreground font-black tracking-widest hover:bg-primary/90 transition-colors"
            >
              LƯU LẠI
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-8">
        {notes.length === 0 && !isAdding && (
          <div className="py-20 text-center border-2 border-dashed border-foreground/10">
            <p className="text-muted-foreground font-serif italic mb-2">Chưa có ghi chú nào được tạo.</p>
            <p className="text-sm font-bold opacity-50 uppercase tracking-widest">Hãy bắt đầu ghi lại kiến thức của bạn.</p>
          </div>
        )}

        {[...notes].sort((a, b) => b.updatedAt - a.updatedAt).map((note) => (
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
                  <button onClick={() => setEditingId(null)} className="p-2 border hover:bg-background"><X className="h-4 w-4" /></button>
                  <button onClick={() => handleUpdate(note.id)} className="p-2 bg-primary text-primary-foreground"><Save className="h-4 w-4" /></button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-black uppercase tracking-tight">{note.title || "Không có tiêu đề"}</h3>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(note)} className="p-2 hover:bg-foreground hover:text-background transition-colors"><Edit3 className="h-4 w-4" /></button>
                    <button onClick={() => deleteNote(note.id)} className="p-2 hover:bg-primary hover:text-primary-foreground transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap font-serif leading-relaxed italic">{note.content}</p>
                <div className="mt-6 pt-4 border-t border-foreground/5 flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    Cập nhật: {new Date(note.updatedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
