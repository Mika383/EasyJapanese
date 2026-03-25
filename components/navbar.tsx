"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Languages, BookOpen, PenTool, Mic2, Edit3, Menu, X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { NavbarUser } from "./navbar-user"
import { useState } from "react"
import { useSession } from "next-auth/react"

interface NavbarProps {
  user?: {
    name?: string | null
    email?: string | null
  } | null
}

export function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const currentUser = session?.user ?? user

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Languages className="h-6 w-6" />
            <span>EasyJapanese</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/alphabet" icon={<BookOpen className="h-4 w-4" />} label="Bảng chữ cái" active={pathname.startsWith("/alphabet")} />
          <NavLink href="/writing" icon={<PenTool className="h-4 w-4" />} label="Luyện viết" active={pathname.startsWith("/writing")} />
          <NavLink href="/dictation" icon={<Mic2 className="h-4 w-4" />} label="Luyện nghe" active={pathname.startsWith("/dictation")} />
          <NavLink href="/notes" icon={<Edit3 className="h-4 w-4" />} label="Ghi chú" active={pathname.startsWith("/notes")} />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          {currentUser ? (
            <NavbarUser name={currentUser.name} email={currentUser.email} />
          ) : pathname !== "/login" ? (
            <Link
              href="/login"
              className="hidden sm:inline-flex h-10 items-center justify-center border-2 border-primary bg-primary px-8 py-2 text-sm font-black uppercase tracking-widest text-primary-foreground transition-all hover:bg-background hover:text-primary focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Đăng nhập
            </Link>
          ) : null}
          
          {/* Mobile Menu Toggle */}
          <button 
            className="flex md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background p-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            <MobileNavLink href="/alphabet" icon={<BookOpen className="h-5 w-5" />} label="Bảng chữ cái" onClick={() => setIsMenuOpen(false)} active={pathname.startsWith("/alphabet")} />
            <MobileNavLink href="/writing" icon={<PenTool className="h-5 w-5" />} label="Luyện viết" onClick={() => setIsMenuOpen(false)} active={pathname.startsWith("/writing")} />
            <MobileNavLink href="/dictation" icon={<Mic2 className="h-5 w-5" />} label="Luyện nghe" onClick={() => setIsMenuOpen(false)} active={pathname.startsWith("/dictation")} />
            <MobileNavLink href="/notes" icon={<Edit3 className="h-5 w-5" />} label="Ghi chú" onClick={() => setIsMenuOpen(false)} active={pathname.startsWith("/notes")} />
            {currentUser ? (
              <div className="mt-4">
                <NavbarUser name={currentUser.name} email={currentUser.email} />
              </div>
            ) : pathname !== "/login" ? (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 flex h-12 items-center justify-center border-2 border-primary bg-primary text-sm font-black uppercase tracking-widest text-primary-foreground"
              >
                Đăng nhập
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  )
}

function MobileNavLink({ href, icon, label, onClick, active }: { href: string; icon: React.ReactNode; label: string; onClick: () => void; active?: boolean }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-4 p-3 rounded-lg hover:bg-muted font-bold transition-all ${active ? "bg-muted text-primary" : "text-foreground"}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

function NavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${active ? "text-primary font-bold" : "text-muted-foreground"}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
