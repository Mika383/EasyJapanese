"use client"

import { useCallback, useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RegisterState {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

const initialForm: RegisterState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
}

export function RegisterForm() {
  const [form, setForm] = useState<RegisterState>(initialForm)
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isSubmitting, startTransition] = useTransition()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const isEmpty = useMemo(
    () => !form.fullName && !form.email && !form.password && !form.confirmPassword,
    [form]
  )

  const handleChange = useCallback(
    (field: keyof RegisterState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
      if (error) setError(null)
    },
    [error]
  )

  const handleAccept = useCallback((checked: boolean) => {
    setAccepted(checked)
    toast(checked ? "Đã đồng ý điều khoản." : "Đã bỏ chọn điều khoản.")
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setHasSubmitted(true)
      setError(null)

      if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
        setError("Vui lòng nhập đầy đủ thông tin đăng ký.")
        toast.error("Thiếu thông tin đăng ký.")
        return
      }

      if (form.password !== form.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp.")
        toast.error("Mật khẩu xác nhận không khớp.")
        return
      }

      if (!accepted) {
        setError("Bạn cần đồng ý điều khoản để tiếp tục.")
        toast.error("Vui lòng đồng ý điều khoản.")
        return
      }

      startTransition(async () => {
        const toastId = "register-submit"
        toast.loading("Đang tạo tài khoản...", { id: toastId })

        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.fullName,
              email: form.email,
              password: form.password,
            }),
          })

          if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            const message = data?.message || "Không thể tạo tài khoản."
            setError(message)
            toast.error(message, { id: toastId })
            return
          }

          const result = await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false,
          })

          if (result?.error) {
            toast.error("Tạo tài khoản thành công, vui lòng đăng nhập.", { id: toastId })
            router.push("/login")
            return
          }

          toast.success("Đăng ký thành công.", { id: toastId })
          router.refresh()
          router.push("/")
        } catch (err) {
          console.error(err)
          setError("Không thể tạo tài khoản.")
          toast.error("Không thể tạo tài khoản.", { id: toastId })
        }
      })
    }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="fullName">Họ và tên</Label>
        <Input
          id="fullName"
          placeholder="Nhập họ và tên"
          value={form.fullName}
          onChange={handleChange("fullName")}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange("email")}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Tạo mật khẩu"
            value={form.password}
            onChange={handleChange("password")}
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            className="pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
            aria-label={showConfirmPassword ? "Ẩn xác nhận mật khẩu" : "Hiện xác nhận mật khẩu"}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Checkbox id="accept" checked={accepted} onCheckedChange={handleAccept} />
        <Label htmlFor="accept" className="text-sm font-medium cursor-pointer">
          Tôi đồng ý với điều khoản sử dụng
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang xử lý
          </>
        ) : (
          "Đăng ký"
        )}
      </Button>

      {hasSubmitted && (
        <div
          className={`border-2 border-dashed p-4 text-sm font-medium ${
            error
              ? "border-destructive text-destructive"
              : "border-border text-muted-foreground"
          }`}
          aria-live="polite"
        >
          {error
            ? error
            : isSubmitting
            ? "Đang kiểm tra dữ liệu..."
            : isEmpty
            ? "Chưa nhập thông tin. Vui lòng điền form để tiếp tục."
            : "Sẵn sàng tạo tài khoản mới."}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 text-sm pt-2 md:pt-3">
        <span className="text-muted-foreground">Đã có tài khoản?</span>
        <Link
          href="/login"
          onClick={() => toast.info("Đi đến trang đăng nhập.")}
          className="border-b-2 border-primary text-primary font-semibold"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </form>
  )
}
