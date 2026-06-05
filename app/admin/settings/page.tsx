import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AdminSettingsForm } from "@/components/admin/admin-settings-form"

export default async function AdminSettingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  if (session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-10">
      <header className="mb-10 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Admin Settings
        </p>
        <h1 className="text-3xl font-black uppercase tracking-tight">Cấu hình hệ thống</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Tinh chỉnh các giới hạn vận hành mà không cần sửa code hoặc đổi biến môi trường.
        </p>
      </header>

      <AdminSettingsForm />
    </div>
  )
}

