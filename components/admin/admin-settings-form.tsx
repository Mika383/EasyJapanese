"use client"

import { useEffect, useState, useTransition } from "react"
import { Save, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type SettingsFormState = {
  savedTranslationLimit: number
  grammarDailyLimit: number
  maxConversationParticipants: number
}

const DEFAULT_STATE: SettingsFormState = {
  savedTranslationLimit: 10,
  grammarDailyLimit: 10,
  maxConversationParticipants: 5,
}

export function AdminSettingsForm() {
  const [form, setForm] = useState<SettingsFormState>(DEFAULT_STATE)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    let isMounted = true

    const fetchSettings = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/admin/settings")
        const data = await response.json()
        if (!response.ok) {
          const message = data?.error?.message || "Không thể tải cấu hình."
          if (isMounted) setError(message)
          toast.error(message)
          return
        }
        if (isMounted) setForm(data.data ?? DEFAULT_STATE)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Không thể tải cấu hình."
        if (isMounted) setError(message)
        toast.error(message)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchSettings()
    return () => {
      isMounted = false
    }
  }, [])

  const handleSubmit = () => {
    startTransition(async () => {
      const toastId = "admin-settings-save"
      toast.loading("Đang lưu cấu hình...", { id: toastId })
      try {
        const response = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        const data = await response.json()
        if (!response.ok) {
          const message = data?.error?.message || "Không thể lưu cấu hình."
          toast.error(message, { id: toastId })
          return
        }
        setForm(data.data)
        toast.success("Đã lưu cấu hình.", { id: toastId })
      } catch (err) {
        const message = err instanceof Error ? err.message : "Đã xảy ra lỗi."
        toast.error(message, { id: toastId })
      }
    })
  }

  if (isLoading) {
    return (
      <div className="border-2 border-dashed border-muted-foreground/30 p-8 text-sm text-muted-foreground">
        Đang tải cấu hình...
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-2 border-destructive/40 bg-background p-8 text-sm text-destructive">
        {error}
      </div>
    )
  }

  return (
    <div className="border-2 border-border bg-background p-6">
      <div className="mb-8 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center border-2 border-foreground">
          <SlidersHorizontal className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Giới hạn hệ thống</h2>
          <p className="text-sm text-muted-foreground">
            Admin không bị giới hạn số bản lưu. Các thông số dưới đây áp dụng cho người dùng thường.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="grid gap-3">
          <Label htmlFor="saved-limit">Số bản dịch được lưu</Label>
          <Input
            id="saved-limit"
            type="number"
            min={1}
            max={1000}
            value={form.savedTranslationLimit}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                savedTranslationLimit: Number(event.target.value),
              }))
            }
          />
          <p className="text-xs text-muted-foreground">Áp dụng khi người dùng bấm lưu bản dịch.</p>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="grammar-limit">Lượt ngữ pháp mỗi ngày</Label>
          <Input
            id="grammar-limit"
            type="number"
            min={1}
            max={1000}
            value={form.grammarDailyLimit}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                grammarDailyLimit: Number(event.target.value),
              }))
            }
          />
          <p className="text-xs text-muted-foreground">Reset theo mốc 12:00 VN như logic hiện tại.</p>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="conversation-participants">Số nhân vật hội thoại</Label>
          <Input
            id="conversation-participants"
            type="number"
            min={2}
            max={20}
            value={form.maxConversationParticipants}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                maxConversationParticipants: Number(event.target.value),
              }))
            }
          />
          <p className="text-xs text-muted-foreground">Mặc định là 5, tối thiểu 2 để bắt đầu hội thoại.</p>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button type="button" onClick={handleSubmit} disabled={isPending}>
          <Save className="h-4 w-4" />
          {isPending ? "Đang lưu" : "Lưu cấu hình"}
        </Button>
      </div>
    </div>
  )
}
