# Repo Exploration Report (Subagent-style)

## 1) Tổng quan nhanh
- Dự án: **EasyJapanese** — web tự học tiếng Nhật.
- Framework chính: **Next.js 16 + TypeScript**.
- UI stack: **Tailwind CSS v4**, có dùng **GSAP** cho animation.
- State: **Zustand** với localStorage.

## 2) Cấu trúc chính
- `app/`: App Router pages (`/`, `/alphabet`, `/notes`) và layout toàn cục.
- `components/`: các component dùng chung như navbar, footer, theme provider, alphabet card/modal.
- `store/`: zustand store cho ghi chú.
- `lib/`: dữ liệu bảng chữ cái và utility.

## 3) Luồng UI hiện có
- `app/layout.tsx`: inject fonts, bọc `ThemeProvider`, render `Navbar` + `Footer` toàn site.
- `app/page.tsx`: landing page có GSAP intro + scroll animations theo section.
- `app/alphabet/page.tsx`: bảng Hiragana/Katakana, animation thẻ chữ khi đổi type, modal chi tiết ký tự.
- `app/notes/page.tsx`: CRUD ghi chú cơ bản, empty-state và chỉnh sửa inline.

## 4) Nhận định kỹ thuật
- Kiến trúc tương đối gọn, tách component hợp lý cho phạm vi hiện tại.
- Có áp dụng animation thống nhất bằng GSAP trên trang chủ và alphabet.
- Có lưu trữ local state cho notes; phù hợp MVP không cần backend.
- Chưa thấy test script trong `package.json` (chỉ có `lint`, `build`, `dev`, `start`).

## 5) Gợi ý bước tiếp theo (không tự ý triển khai)
1. Bổ sung test cơ bản (unit/integration) cho store và key UI flow.
2. Chuẩn hóa loading/error/empty states trên tất cả màn hình.
3. Tách thêm các phần lớn của `app/page.tsx` thành section components để dễ scale.
4. Bổ sung route guards hoặc auth flow đầy đủ nếu mở rộng tính năng người dùng.

---
Báo cáo này được tạo theo yêu cầu “spawn a subagent to explore repo”; trong môi trường hiện tại, agent đã thực hiện **exploration tương đương subagent** và ghi nhận kết quả ở đây.
