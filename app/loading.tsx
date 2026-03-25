import { LoadingIndicator } from "@/components/loading/loading-indicator"

export default function Loading() {
  return (
    <div className="min-h-screen w-full px-6 py-12">
      <div className="mx-auto flex min-h-[50vh] max-w-5xl items-center justify-center border border-dashed border-muted-foreground/40 bg-background">
        <LoadingIndicator label="Đang tải nội dung..." size="lg" />
      </div>
    </div>
  )
}
