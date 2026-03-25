import { Languages } from "lucide-react"

export function LoginHeader() {
  return (
    <div className="login-animate space-y-4">
      <div className="inline-flex items-center gap-3 border-2 border-foreground px-4 py-2 text-xs font-black uppercase tracking-[0.3em]">
        <Languages className="h-4 w-4" />
        <span>EasyJapanese</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight">
        Đăng nhập để tiếp tục hành trình
      </h1>
      <p className="text-base md:text-lg text-muted-foreground font-serif italic">
        Hệ thống ghi nhớ lộ trình học, lưu ghi chú và đồng bộ tiến độ của bạn.
      </p>
    </div>
  )
}
