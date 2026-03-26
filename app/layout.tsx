import type { Metadata } from "next";
import { Be_Vietnam_Pro, Noto_Sans_JP, Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingBackground } from "@/components/floating-background";
import { auth } from "@/auth";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { RouteLoading } from "@/components/loading/route-loading";
import { PageReveal } from "@/components/loading/page-reveal";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const sans = Be_Vietnam_Pro({ 
  subsets: ["latin", "vietnamese"], 
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-sans"
});

const serif = Lora({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif"
});

const jp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-jp"
});

export const metadata: Metadata = {
  title: "EasyJapanese — Tự học tiếng Nhật",
  description: "Website tự học tiếng Nhật: ghi chú từ vựng, luyện viết, luyện nghe, ngữ pháp và flashcard.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${sans.variable} ${serif.variable} ${jp.variable} font-sans antialiased text-pretty`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthSessionProvider session={session}>
            <FloatingBackground />
            <Navbar user={session?.user} />
            <RouteLoading />
            <main className="min-h-screen">
              <PageReveal>{children}</PageReveal>
            </main>
            <Footer />
            <Toaster
              position="top-right"
              richColors
              toastOptions={{
                className: "text-lg px-6 py-4 font-semibold",
              }}
            />
          </AuthSessionProvider>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
