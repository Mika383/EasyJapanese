import { NotesClient } from "@/components/notes/notes-client"
import { getNotes } from "@/app/notes/actions"
import type { NoteListItem } from "@/app/notes/actions"
import { auth } from "@/auth"

export default async function NotesPage() {
  const session = await auth()
  const isLoggedIn = !!session?.user?.id
  const notes: NoteListItem[] = await getNotes()
  return (
    <NotesClient
      initialNotes={notes}
      serverError={isLoggedIn ? null : "Bạn cần đăng nhập để xem và tạo ghi chú."}
    />
  )
}
