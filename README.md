# 🇯🇵 EasyJapanese — Nền Tảng Tự Học Tiếng Nhật Toàn Diện

> *"Hành trình vạn dặm bắt đầu từ một bước chân."*

**EasyJapanese** là một ứng dụng web mã nguồn mở hỗ trợ tự học tiếng Nhật, được xây dựng với thiết kế hiện đại theo phong cách **Brutalist Typography** kết hợp cảm hứng Zen Nhật Bản. Ứng dụng cung cấp các công cụ học tập toàn diện từ bảng chữ cái, ghi chú ngữ pháp & từ vựng, dịch thuật AI, cho đến luyện viết và luyện nghe.

---

## 🌐 Tổng Quan Các Trang

### 🏠 Trang Chủ (`/`)
Landing page giới thiệu toàn bộ hệ sinh thái học tập với hiệu ứng cuộn GSAP ScrollTrigger. Bao gồm 3 section chính:
- **Nền tảng** — Bảng chữ cái Hiragana & Katakana
- **Kỹ năng** — Luyện viết chữ Kanji & Kana
- **Phản xạ** — Nghe chép chính tả thông minh

### 🔤 Bảng Chữ Cái (`/alphabet`)
Trang học bảng chữ cái tương tác với đầy đủ:
- **Hiragana & Katakana** — chuyển đổi qua lại bằng nút bấm
- **3 nhóm ký tự**: Gojūon (cơ bản), Dakuten/Handakuten (biến âm), Yōon (âm ghép)
- **Thẻ ký tự động** — animation stagger GSAP khi chuyển chế độ
- **Modal chi tiết** — hiển thị ký tự lớn, phiên âm Romaji, loại ký tự, từ vựng ví dụ minh họa
- **Phát âm** — tích hợp Web Speech API đọc chuẩn giọng Nhật (`ja-JP`)
- **Responsive** — modal tự động scale & chuyển layout phù hợp mọi kích thước màn hình qua React Portal

### 🌐 Dịch Thuật AI (`/translate`)
Công cụ dịch thuật thông minh tích hợp Gemini AI:
- **Dịch văn bản** — nhập câu tiếng Nhật, nhận bản dịch tiếng Việt
- **Dịch ảnh (OCR)** — chụp/tải ảnh chứa chữ Nhật, AI tự nhận diện và dịch
- **Phiên âm Kana & Romaji** — hiển thị cách đọc cho từng từ
- **Giải thích ngữ pháp** — phân tích cấu trúc ngữ pháp chi tiết (có giới hạn lượt/ngày cho tài khoản thường)
- **Lịch sử dịch** — lưu lại các bản dịch đã thực hiện (yêu cầu đăng nhập)

### 📝 Ghi Chú Học Tập (`/notes`)
Hệ thống ghi chú cá nhân với 2 loại chuyên biệt:

**Ghi chú Ngữ pháp:**
- Tiêu đề ngữ pháp, công thức, mô tả cách dùng
- Nhiều câu ví dụ (tiếng Nhật + nghĩa tiếng Việt)
- Hỗ trợ chia sẻ công khai (public share) với mã chia sẻ riêng
- Hệ thống Like/Dislike và Lưu bài

**Ghi chú Từ vựng:**
- Hỗ trợ 3 dạng chữ: Kanji, Hiragana, Katakana
- Phân loại từ loại: danh từ, động từ, tính từ, trạng từ...
- Trường phiên âm (reading) và nghĩa tiếng Việt

### ✍️ Luyện Viết (`/writing`) — *Đang phát triển*
Bảng vẽ Kanji và Kana tương tác, hướng dẫn viết từng nét chữ.

### 🎧 Luyện Nghe (`/dictation`) — *Đang phát triển*
Hệ thống bài tập nghe hiểu (Dictation & Shadowing) để cải thiện phản xạ âm thanh.

### 🔐 Xác Thực (`/login`, `/register`)
- Đăng ký & đăng nhập bằng email/mật khẩu (mã hoá bcrypt)
- Phân quyền người dùng: Student, Teacher, Staff, Admin
- Navbar tự động hiển thị thông tin người dùng hoặc nút đăng nhập

### ⚠️ Trang Lỗi & 404
- **Trang lỗi** (`error.tsx`) — hiển thị khi có lỗi runtime, với nút "Thử lại" và "Về trang chủ"
- **Trang 404** (`not-found.tsx`) — thiết kế sáng tạo với kanji 迷路 (めいろ - Lạc đường)
- Cả hai đều có animation GSAP và phong cách nhất quán với toàn ứng dụng

---

## 🎨 Thiết Kế & Trải Nghiệm

| Thành phần | Chi tiết |
|---|---|
| **Phong cách** | Brutalist Typography + Zen Japanese aesthetics |
| **Dark / Light Mode** | Chuyển đổi mượt mà qua `next-themes` |
| **Animations** | GSAP (stagger, timeline, ScrollTrigger, floating elements) |
| **Responsive** | Mobile-first, adaptive layout, CSS scale cho modal |
| **Floating Background** | Hiệu ứng hạt nổi trang trí trên mọi trang |
| **Loading States** | Route loading indicator + Page reveal animation |
| **Notifications** | Sonner toast (success, error, warning) — không dùng alert/confirm mặc định |
| **Font chữ** | Be Vietnam Pro (UI), Lora (serif), Noto Sans JP (tiếng Nhật) |

---

## 🛠️ Tech Stack

| Layer | Công nghệ |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19 + TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Components** | shadcn/ui + Radix UI |
| **Database** | PostgreSQL (Neon) + Prisma ORM |
| **Auth** | NextAuth v5 (Credentials) |
| **AI** | Google Gemini API |
| **Animations** | GSAP + @gsap/react |
| **State** | Zustand |
| **Validation** | Zod |
| **Notifications** | Sonner |
| **Analytics** | Vercel Analytics |
| **Deployment** | Vercel |

---

## 📂 Cấu Trúc Thư Mục

```text
easyjapanese/
├── app/
│   ├── api/
│   │   ├── auth/               # NextAuth endpoints
│   │   └── translate/          # API dịch thuật (Gemini AI)
│   ├── alphabet/               # Bảng chữ cái Hiragana & Katakana
│   ├── dictation/              # Luyện nghe (coming soon)
│   ├── login/                  # Đăng nhập
│   ├── notes/                  # Ghi chú ngữ pháp & từ vựng
│   ├── register/               # Đăng ký
│   ├── translate/              # Dịch thuật AI
│   ├── writing/                # Luyện viết (coming soon)
│   ├── error.tsx               # Trang lỗi runtime
│   ├── not-found.tsx           # Trang 404
│   ├── loading.tsx             # Global loading
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── alphabet/               # CharacterCard, CharacterModal
│   ├── auth/                   # SessionProvider
│   ├── loading/                # RouteLoading, PageReveal
│   ├── login/                  # Form đăng nhập
│   ├── notes/                  # NotesClient, NoteForm...
│   ├── register/               # Form đăng ký
│   ├── translate/              # TranslatePage, TranslateForm, TranslateResult
│   ├── ui/                     # shadcn/ui components
│   ├── coming-soon.tsx         # Component cho trang đang phát triển
│   ├── floating-background.tsx # Hiệu ứng nền floating
│   ├── footer.tsx              # Footer chung
│   ├── navbar.tsx              # Navbar responsive (desktop + mobile)
│   ├── navbar-user.tsx         # User dropdown menu
│   ├── theme-provider.tsx      # Dark/Light mode provider
│   └── theme-toggle.tsx        # Nút chuyển theme
├── lib/
│   ├── alphabet-data.ts        # Dữ liệu bảng chữ cái (46+ ký tự)
│   ├── gemini.ts               # Gemini AI client
│   ├── prisma.ts               # Prisma client singleton
│   └── utils.ts                # Utility functions (cn)
├── prisma/
│   ├── schema.prisma           # Database schema (10+ models)
│   ├── seed.mjs                # Seed script
│   └── migrations/             # Migration history
├── store/                      # Zustand stores
├── types/
│   └── next-auth.d.ts          # NextAuth type extensions
├── auth.ts                     # NextAuth config
├── middleware.ts                # Route protection middleware
└── package.json
```

---

## 🗄️ Database Schema

Hệ thống sử dụng PostgreSQL với Prisma ORM, bao gồm các model chính:

- **User** — Thông tin người dùng, phân quyền (Student/Teacher/Staff/Admin)
- **Note** — Ghi chú tổng quát, liên kết tới GrammarNote hoặc VocabNote
- **GrammarNote** — Ngữ pháp với công thức, ví dụ, chia sẻ công khai
- **GrammarExample** — Câu ví dụ cho ngữ pháp
- **GrammarReaction** — Like/Dislike cho ngữ pháp chia sẻ
- **GrammarSave** — Lưu bài ngữ pháp
- **VocabNote** — Từ vựng với Kanji/Hiragana/Katakana, từ loại
- **TranslationHistory** — Lịch sử dịch thuật
- **GrammarExplainUsage** — Giới hạn lượt giải thích ngữ pháp/ngày

---

## 🚀 Hướng Dẫn Cài Đặt

### Yêu cầu
- Node.js >= 18
- PostgreSQL database (khuyến nghị [Neon](https://neon.tech))

### Bước 1: Cài dependencies
```bash
npm install
```

### Bước 2: Thiết lập môi trường
Tạo file `.env.local` với các biến môi trường cần thiết (tham khảo `.env.example` nếu có).

### Bước 3: Migrate & Generate Prisma
```bash
npx prisma migrate deploy
npx prisma generate
```

### Bước 4: Seed dữ liệu ban đầu
```bash
npm run seed
```

### Bước 5: Chạy development server
```bash
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000) để bắt đầu.

---

## 🗺️ Roadmap

### Đã hoàn thành
- [x] Core UI với phong cách Brutalist + GSAP animations
- [x] Dark / Light mode
- [x] Responsive layout (desktop + mobile)
- [x] Bảng chữ cái Hiragana & Katakana tương tác
- [x] Modal chi tiết ký tự với phát âm
- [x] Hệ thống xác thực (đăng ký / đăng nhập)
- [x] Phân quyền người dùng (Student, Teacher, Staff, Admin)
- [x] Ghi chú ngữ pháp (công thức, ví dụ, CRUD)
- [x] Ghi chú từ vựng (Kanji, Hiragana, Katakana)
- [x] Dịch thuật AI (Gemini) — văn bản + ảnh
- [x] Giải thích ngữ pháp AI với giới hạn lượt
- [x] Lịch sử dịch thuật
- [x] Trang lỗi & 404 với thiết kế nhất quán
- [x] Vercel Analytics
- [x] Floating background decoration

### Đang phát triển
- [ ] Luyện viết chữ Kanji & Kana (bảng vẽ tương tác)
- [ ] Luyện nghe Dictation & Shadowing
- [ ] Flashcard hệ thống (Spaced Repetition)

### Kế hoạch tương lai
- [ ] Chia sẻ công khai ngữ pháp (public share, like/dislike)
- [ ] Hệ thống bài học theo cấp độ (N5 → N1)
- [ ] Streak tracking & gamification
- [ ] OAuth (Google, GitHub)
- [ ] PWA support cho học offline
- [ ] Leaderboard & thành tựu

---

## 🤝 Quy Tắc Phát Triển

- Luôn tách component nhỏ, tránh file monolithic
- Ưu tiên shadcn/ui cho UI components + GSAP cho animations
- Có đủ trạng thái: loading, error, empty
- Không commit trực tiếp vào `main` / `master`
- Dùng Sonner cho mọi thông báo, không dùng `alert()` / `confirm()`
- Mọi lỗi phải được xử lý và hiển thị rõ ràng cho người dùng
- Đảm bảo semantic HTML và accessibility cơ bản

---

## 📄 License

Dự án được phát triển cho mục đích học tập cá nhân.

---

Cảm ơn bạn đã đồng hành cùng **EasyJapanese** — 一緒に頑張りましょう！🌸
