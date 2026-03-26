import Link from "next/link"
import { Languages } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-foreground/10 bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-foreground">
              <Languages className="h-8 w-8 text-primary" />
              <span className="tracking-tighter uppercase">EasyJapanese</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left font-serif italic">
              &quot;Ngôn ngữ là chìa khóa mở ra tâm hồn của một quốc gia.&quot;
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-16">
            <FooterLinkGroup 
              title="Học tập"
              links={[
                { label: "Bảng chữ cái", href: "/alphabet" },
                { label: "Luyện viết", href: "/writing" },
                { label: "Nghe chép", href: "/dictation" },
              ]}
            />
            <FooterLinkGroup 
              title="Hỗ trợ"
              links={[
                { label: "Về chúng tôi", href: "/about" },
                { label: "Chính sách", href: "/policy" },
                { label: "Liên hệ", href: "/contact" },
              ]}
            />
            <FooterLinkGroup
              title="Kết nối"
              links={[
                { label: "Facebook", href: "https://www.facebook.com/DHCrafter/" },
                { label: "Instagram", href: "https://www.instagram.com/dwuyhaiii/" },
                { label: "Email", href: "mailto:duyhai03082003@gmail.com" },
                { label: "Phone", href: "tel:0856686130" },
              ]}
            />
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-foreground/5 text-center text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
          &copy; {currentYear} EASY JAPANESE. THIẾT KẾ TINH GIẢN CHO VIỆC HỌC TẬP.
        </div>
      </div>
    </footer>
  )
}

type FooterLink = { label: string; href: string }

function FooterLinkGroup({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="flex flex-col gap-6">
      <h4 className="text-xs font-black uppercase tracking-[0.2em]">{title}</h4>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            {link.href.startsWith("http") ? (
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex pl-2 text-sm text-muted-foreground transition-transform transition-colors -translate-x-2 hover:translate-x-0 hover:text-primary"
                suppressHydrationWarning
              >
                {link.label}
              </a>
            ) : link.href.startsWith("mailto:") || link.href.startsWith("tel:") ? (
              <a
                href={link.href}
                className="inline-flex pl-2 text-sm text-muted-foreground transition-transform transition-colors -translate-x-2 hover:translate-x-0 hover:text-primary"
                suppressHydrationWarning
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="inline-flex pl-2 text-sm text-muted-foreground transition-transform transition-colors -translate-x-2 hover:translate-x-0 hover:text-primary"
                suppressHydrationWarning
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
