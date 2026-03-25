import { Sparkles } from "lucide-react"

export function RegisterHeader() {
  return (
    <div className="register-animate space-y-4">
      <div className="inline-flex items-center gap-3 border-2 border-foreground px-4 py-2 text-xs font-black uppercase tracking-[0.3em]">
        <Sparkles className="h-4 w-4" />
        <span>Bắt đầu</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight">
        Tạo tài khoản để học nhanh hơn
      </h1>
      <p className="text-base md:text-lg text-muted-foreground font-serif italic">
        Lưu tiến độ học, ghi chú và bài tập cá nhân trên mọi thiết bị.
      </p>
    </div>
  )
}
