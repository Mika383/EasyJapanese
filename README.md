# 🇯🇵 EasyJapanese — Nền Tảng Tự Học Tiếng Nhật Toàn Diện

EasyJapanese là một dự án website hỗ trợ tự học tiếng Nhật với trải nghiệm hiện đại, trực quan. Ứng dụng tập trung vào nền tảng chữ cái, ghi chú học tập, luyện viết, luyện nghe và hệ thống đăng nhập/đăng ký.

---

## ✨ Các Tính Năng Hiện Có

- 🔤 Học Bảng Chữ Cái (Alphabet)
- Hiển thị Hiragana, Katakana.
- Thẻ chữ cái có animation GSAP.
- 📝 Hệ Thống Ghi Chú (Notes)
- Tạo ghi chú theo 2 loại: Ngữ pháp và Từ vựng.
- Ngữ pháp có công thức, mô tả, nhiều ví dụ và tiêu đề ngữ pháp.
- Từ vựng hỗ trợ Kanji/Hiragana/Katakana + từ loại.
- Dữ liệu lưu trên PostgreSQL qua Prisma.
- 🔒 Xác Thực Người Dùng (Authentication)
- NextAuth v5 (Credentials).
- Đăng ký/đăng nhập dùng DB thật.
- Navbar đổi trạng thái theo session (Profile + Đăng xuất).
- 🎨 UX/UI
- Dark/Light mode (`next-themes`).
- Responsive layout với Tailwind CSS v4.
- Toast notifications (Sonner).
- GSAP animations.

---

## 🛠️ Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript 5
- Tailwind CSS v4
- Prisma + PostgreSQL (Neon)
- NextAuth v5
- GSAP
- Sonner
- Zod

---

## 📂 Cấu Trúc Thư Mục

```text
easyjapanese/
├── app/
│   ├── api/
│   │   └── auth/                # NextAuth + API đăng ký/đăng nhập
│   ├── alphabet/
│   ├── login/
│   ├── register/
│   ├── notes/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── alphabet/
│   ├── auth/                    # SessionProvider
│   ├── login/
│   ├── register/
│   ├── notes/
│   ├── ui/                       # shadcn/ui + dropdown
│   ├── footer.tsx
│   ├── navbar.tsx
│   └── navbar-user.tsx
├── lib/
│   ├── prisma.ts
│   ├── utils.ts
│   └── alphabet-data.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── store/
├── public/
├── types/
│   └── next-auth.d.ts
├── auth.ts
├── middleware.ts
└── package.json
```

---

## 🚀 Hướng Dẫn Cài Đặt (Local Development)

Bước 1: Cài dependencies
```bash
npm install
```

Bước 2: Thiết lập môi trường
Tạo `.env.local` theo mẫu `.env.example` (nếu có) và đảm bảo có các biến cần thiết:
```env
AUTH_SECRET=your-strong-secret
DATABASE_URL=postgresql://...
```

Bước 3: Migrate DB
```bash
npx prisma migrate deploy
npx prisma generate
```

Bước 4: Seed dữ liệu
```bash
npm run seed
```

Bước 5: Chạy dev
```bash
npm run dev
```

---

## 🗺️ Roadmap

- [x] Core UI + GSAP + Dark/Light mode
- [x] Auth (Credentials + DB)
- [x] Notes DB + schema chuẩn hóa
- [ ] Public share / save / like / dislike cho ngữ pháp
- [ ] Flashcard + Grammar module
- [ ] Dictation + Writing module
- [ ] Production deploy

---

## 🤝 Guidelines

- Luôn tách component nhỏ, tránh file lớn.
- Ưu tiên shadcn/ui + GSAP.
- Có đủ trạng thái loading/error/empty.
- Không commit trực tiếp vào main/master.

---

Cảm ơn bạn đã đồng hành cùng EasyJapanese!
