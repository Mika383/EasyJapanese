import { Check } from "lucide-react"

const BENEFITS = [
  "Lưu tiến độ học tập và bài tập", 
  "Đồng bộ ghi chú đa thiết bị",
  "Nhắc lịch học tập thông minh",
]

export function LoginBenefits() {
  return (
    <div className="login-animate space-y-4 border-2 border-border p-6">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Quyền lợi</p>
      <div className="space-y-3">
        {BENEFITS.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center border-2 border-foreground">
              <Check className="h-3 w-3" />
            </span>
            <p className="text-sm font-medium text-foreground/80">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
