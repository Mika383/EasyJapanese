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

interface FormState {
  email: string
  password: string
}

const initialForm: FormState = {
  email: "",
  password: "",
}

export function LoginForm() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isSubmitting, startTransition] = useTransition()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const isEmpty = useMemo(
    () => !form.email && !form.password,
    [form]
  )

  const handleChange = useCallback(
    (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
      if (error) setError(null)
    },
    [error]
  )

  const handleRemember = useCallback((checked: boolean) => {
    setRemember(checked)
    toast(checked ? "Đã bật ghi nhớ đăng nhập." : "Đã tắt ghi nhớ đăng nhập.")
  }, [])

  const handleForgot = useCallback(() => {
    toast.info("Tính năng quên mật khẩu sẽ sớm khả dụng.")
  }, [])


  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setHasSubmitted(true)
      setError(null)

      if (!form.email || !form.password) {
        setError("Vui lòng nhập đầy đủ email và mật khẩu.")
        toast.error("Thiếu thông tin đăng nhập.")
        return
      }

      startTransition(async () => {
        const toastId = "login-submit"
        toast.loading("Đang xác thực thông tin...", { id: toastId })

        try {
          const result = await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false,
          })

          if (result?.error) {
            setError("Email hoặc mật khẩu không đúng.")
            toast.error("Đăng nhập thất bại.", { id: toastId })
            return
          }

          toast.success("Đăng nhập thành công.", { id: toastId })
          router.refresh()
          router.push("/")
        } catch (err) {
          console.error(err)
          setError("Không thể đăng nhập.")
          toast.error("Không thể đăng nhập.", { id: toastId })
        }
      })
    },
    [form, router]
  )

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
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
            placeholder="Nhập mật khẩu"
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Checkbox id="remember" checked={remember} onCheckedChange={handleRemember} />
          <Label htmlFor="remember" className="text-sm font-medium cursor-pointer">
            Ghi nhớ đăng nhập
          </Label>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="h-9 px-3 text-xs normal-case tracking-normal font-semibold"
          onClick={handleForgot}
        >
          Quên mật khẩu
        </Button>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang xử lý
          </>
        ) : (
          "Đăng nhập"
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
            : "Sẵn sàng đăng nhập khi bạn gửi biểu mẫu."}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 text-sm pt-2 md:pt-3">
        <span className="text-muted-foreground">Chưa có tài khoản?</span>
        <Link
          href="/register"
          onClick={() => toast.info("Đi đến trang đăng ký.")}
          className="border-b-2 border-primary text-primary font-semibold"
        >
          Đăng ký ngay
        </Link>
      </div>
    </form>
  )
}
