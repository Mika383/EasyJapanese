# EasyJapanese Design Context

## Design Summary

EasyJapanese uses a restrained Japanese editorial product style: paper background, ink text, Kurenai red accent, square geometry, ruled grids, heavy typographic hierarchy, and quiet motion. Any future impeccable work must start from this project's current UI, not from patterns used in other projects.

## Color System

Use the existing OKLCH tokens in `app/globals.css`.

- Background: `oklch(0.97 0.01 80)`, warm paper.
- Foreground: `oklch(0.15 0 0)`, ink black.
- Primary: `oklch(0.45 0.12 30)`, Kurenai red.
- Secondary and muted: warm paper-gray surfaces.
- Dark mode: near-Sumi dark surfaces with warm paper text.

Color strategy: restrained. Use primary red as an accent, usually below 10 percent of a surface. Let borders, typography, and layout carry most hierarchy.

Rules:

- No gradients unless explicitly requested by the user.
- No pure `#000` or `#fff`; use project tokens.
- Use `bg-primary/5`, `bg-secondary/20`, and border opacity for emphasis.
- Keep destructive actions visually explicit through the destructive token and Sonner feedback.

## Typography

Fonts are defined in `app/layout.tsx`.

- `Be Vietnam Pro`: default sans for Vietnamese UI, controls, labels, headings.
- `Noto Sans JP`: Japanese characters, kana, kanji displays.
- `Lora`: italic reflective copy, quotations, notes, and softer study text.

Hierarchy:

- Hero and learning-page titles: heavy, uppercase, tight tracking.
- Section labels: small, uppercase, bold, wide tracking.
- Body/tool text: compact, readable, direct.
- Japanese characters: large, centered, visually dominant when the task is character learning.

Avoid:

- Overusing italic serif for functional labels.
- Negative letter spacing except where already established for large headings.
- Viewport-based font scaling.

## Layout

The product favors visible structure:

- Containers use `container mx-auto px-4`.
- Learning pages can use large vertical rhythm: `py-20`, `py-32`, `mb-16`, `mb-24`.
- Tool pages should be denser: `space-y-6`, `space-y-8`, two-column grids on desktop.
- Use borders, separators, and grid lines as primary structure.
- Avoid nested cards.
- Avoid page sections styled as floating decorative cards.

Preferred patterns:

- Hero learning sections with centered title, quotation, and strong CTA.
- Kana/kanji grids with hard borders and square cells.
- Tool panels with simple border, background token, and compact headings.
- Empty states with dashed borders and concise copy.

## Shape, Borders, and Elevation

Current radius is intentionally zero: `--radius: 0rem`.

- Prefer square or nearly square surfaces.
- Use `border`, `border-2`, or `border-4` when hierarchy needs it.
- Shadows are rare and graphic, usually hard offset shadows on learning grids or modal surfaces.
- Avoid soft shadows, glassmorphism, bokeh, decorative glow, and excessive rounded corners.

## Components

Always use shadcn/ui components unless explicitly instructed otherwise. Extend the existing local components instead of creating one-off controls.

Existing UI language:

- `Button`: uppercase, bold, border-driven, primary fill or outline.
- `Card`: flat `border-2`, no radius, no soft shadow.
- `Navbar`: sticky, compact, background blur, Lucide icon + text links.
- `Footer`: editorial, spacious, grouped links, small uppercase metadata.
- `CharacterCard`: square grid cell, Japanese character first, romaji secondary.
- `CharacterModal`: strong bordered modal, character display, examples, audio action.
- `TranslatePage`: functional tool layout with clear result, loading, error, history, and usage states.
- `Notes`: editorial note cards, inline editing, icon buttons, empty state.

Controls:

- Use icons for compact actions: edit, delete, save, close, menu, audio.
- Use Sonner for all feedback.
- Use AlertDialog for destructive confirmation flows.
- Use labels, semantic controls, and keyboard-accessible buttons.

## Motion

GSAP is the primary animation system for this project. Future UI work should use GSAP to create smooth, purposeful motion that supports learning flow, makes state changes feel clear, and uses scroll-triggered movement to make pages feel alive.

- Use `useGSAP` with scoped refs for page-level entrance and repeated elements.
- Use `gsap.timeline()` for sequenced page or component choreography instead of manual delays.
- Use `gsap.from`, `gsap.to`, and `gsap.fromTo` for focused transitions.
- Use `ScrollTrigger` as a first-class motion tool for scroll reveal, scrubbed progress, pinned study sections, active-state changes, and occasional horizontal learning sequences.
- Use `stagger` for kana grids, note lists, feature lists, and repeated learning items.
- Use `autoAlpha`, `x`, `y`, `scale`, `rotation`, and transform aliases instead of layout properties.
- Prefer `power2.out`, `power3.out`, `power4.out`, or `expo.out` for smooth ease-out movement.
- Keep most UI transitions between 150ms and 600ms; larger editorial page reveals can be up to about 900ms.
- Avoid bounce, elastic, long decorative motion, and layout-property animation.
- Respect user focus; motion should support orientation, not distract from study.

GSAP implementation rules:

- In React client components, use `useGSAP` and scope selectors to a local ref.
- Clean up tweens, timelines, and ScrollTriggers through GSAP context or `matchMedia` cleanup.
- Use `gsap.matchMedia()` for responsive animation differences and `prefers-reduced-motion`.
- When reduced motion is requested, skip decorative movement or reduce duration to zero while preserving state feedback.
- For frequent pointer-driven motion, use `gsap.quickTo()` rather than creating new tweens on every event.
- Do not create hundreds of simultaneous tweens; batch repeated elements with `stagger` and test responsiveness.

Preferred animation moments:

- Page reveal after route changes.
- Hero title, quote, and CTA entrance.
- Learning grids entering with subtle stagger.
- Character modal open and close.
- Translate result, loading, error, empty, and saved-history transitions.
- Notes add/edit/delete state changes.
- Navbar mobile menu reveal.

## ScrollTrigger System

Use a varied ScrollTrigger vocabulary so long pages feel dynamic without losing the disciplined EasyJapanese identity.

Recommended ScrollTrigger types:

- Batch reveal: use `ScrollTrigger.batch()` for repeated cards, note rows, feature blocks, and kana groups entering the viewport.
- Section timeline: attach `scrollTrigger` to a parent `gsap.timeline()` for coordinated text, rule, icon, and character reveals.
- Scrubbed progress: use `scrub: 0.5` to `scrub: 1` for subtle parallax, progress lines, character scale, or background character drift.
- Pinning: use `pin: true` for focused study moments, such as a kana family, grammar breakdown, or step-by-step writing explanation. Animate children, not the pinned wrapper.
- Toggle class: use `toggleClass` for active navigation, current lesson markers, or a study-progress rail.
- Callbacks: use `onEnter`, `onLeaveBack`, and `onUpdate` for small state changes such as activating section labels or progress indicators.
- Horizontal/container animation: use pinned horizontal movement for sequences that naturally read left-to-right, such as kana families, grammar steps, or translation workflow stages. Use `ease: "none"` on the container animation.
- Snap: use light `snap` only for intentionally segmented learning flows. Avoid snap on ordinary reading pages.

Page-level ScrollTrigger guidance:

- Home: use section timelines, scrubbed Japanese character accents, and feature reveals. Avoid over-pinning the first viewport.
- Alphabet: use batch reveal for grids and optional scrubbed section headers. Pin only a focused learning explanation, not the whole grid.
- Translate: keep ScrollTrigger minimal. Use it only for history/result reveal or a compact progress/usage section.
- Notes: use batch reveal for note cards and subtle state changes for active editing areas.
- Auth: use simple reveal. Avoid scroll drama because the user is trying to complete a form.

ScrollTrigger guardrails:

- Register `ScrollTrigger` once before use.
- Use `useGSAP` scoped to a ref so ScrollTriggers clean up on route/component changes.
- Put ScrollTrigger on top-level tweens or timelines, never on a child tween inside a timeline.
- Choose either `scrub` or `toggleActions` for a trigger, not both.
- Create triggers in page order or set `refreshPriority`.
- Remove `markers: true` before delivery.
- Call `ScrollTrigger.refresh()` after dynamic content, images, fonts, or layout changes that affect trigger positions.
- Keep pinned sections rare and purposeful; too many pinned areas make study feel blocked.
- Respect `prefers-reduced-motion`: disable scrub, pin, parallax, and horizontal scroll effects or replace them with instant state changes.

## Page-Specific Guidance

Home:

- Keep the brand visible and typographic.
- Preserve strong CTA buttons and feature sections.
- Use real learning affordances or Japanese character visuals, not generic illustrations.

Alphabet:

- Preserve the grid-first experience.
- Japanese characters must remain the main visual signal.
- Keep type toggles strong and simple.
- Detail views should prioritize character, romaji, type, example words, and audio.

Translate:

- Treat this as a utility surface.
- Keep controls compact and stateful.
- Preserve visible usage, loading, error, empty, result, history, and detail states.
- Do not make it look like a marketing page.

Notes:

- Preserve the study notebook feel.
- Editing should remain inline when possible.
- Empty states should be encouraging but short.

Auth:

- Keep the two-column editorial layout.
- Benefits and notices can be bordered panels, not decorative cards.
- Keep login/register forms practical and direct.

## Accessibility and Feedback

- Every interactive icon button needs an accessible name.
- Focus states must remain visible.
- Contrast must be checked against background and muted states.
- Loading, error, warning, info, and success states must be explicit.
- Never fail silently.
- Do not use browser default `alert`, `confirm`, `prompt`, or notification APIs.

## Implementation Guardrails

- Keep files small and components reusable.
- Separate layout, header, nav, footer, body, and feature components.
- Do not put all UI or logic into a single page file.
- Avoid hardcoded design values when a token or existing component exists.
- Keep changes minimal and within scope.
- Preserve stable UI unless explicitly asked to change it.
- Before delivering UI changes, run lint/build where feasible and visually verify responsive behavior.

## Runtime Testing Guardrails

- Always stop any dev server or local process started for testing before finishing the task.
- Avoid occupying common user ports such as `3000`, `3001`, `5173`, or `8080` for ad hoc testing unless the user explicitly asks for that port.
- Prefer uncommon temporary ports for agent-run test servers, then report the URL and shut the server down after verification.
- Before starting a server, check whether the port is already in use. If a user-owned process is running, do not kill it unless the user explicitly requests it.

## Current Risks To Remember

- Several Vietnamese and Japanese strings currently appear mojibake when read from the repository. New work should preserve proper UTF-8 and avoid adding more corrupted text.
- Some pages mix square editorial styling with default rounded shadcn utility panels. When polishing, align toward the square editorial system while preserving usability.
- The project is configured to avoid product/design decisions without confirmation, so ambiguous feature or style choices require clarification first.
