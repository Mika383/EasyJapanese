"use client"

import { useTransition } from "react"
import { LogOut, User } from "lucide-react"
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavbarUserProps {
  name?: string | null
  email?: string | null
}

export function NavbarUser({ name, email }: NavbarUserProps) {
  const [isPending, startTransition] = useTransition()
  const displayName = name || email || "Tài khoản"

  const handleLogout = () => {
    startTransition(async () => {
      const toastId = "logout"
      toast.loading("Đang đăng xuất...", { id: toastId })
      try {
        await signOut({ callbackUrl: "/" })
      } catch (error) {
        console.error(error)
        toast.error("Không thể đăng xuất.", { id: toastId })
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-10 px-4 text-xs normal-case tracking-normal font-semibold"
        >
          <User className="h-4 w-4" />
          Profile
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
        <div className="px-3 pb-2 text-xs text-muted-foreground">
          {displayName}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isPending} className="text-destructive">
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
