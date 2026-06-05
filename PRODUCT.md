# EasyJapanese Product Context

## Product

EasyJapanese is a Vietnamese-first web application for self-learning Japanese. It helps learners build foundations in kana, practice writing and listening, translate Japanese text or images, and save study notes.

The product should feel like a focused study desk: calm, structured, editorial, and deliberate. It is not a generic SaaS dashboard, not a marketing landing page, and not a playful language-learning toy.

## Register

product

Design serves learning workflows first. Brand expression is allowed, but it must support clarity, repetition, recall, and daily use.

## Primary Users

- Vietnamese learners studying Japanese independently.
- Beginners who need kana, vocabulary, grammar notes, dictation, and translation support.
- Returning learners who need quick access to saved notes and translation history.

## Product Purpose

- Make Japanese study feel organized and less intimidating.
- Keep learner attention on characters, examples, translations, and notes.
- Provide immediate feedback for every user-facing action through Sonner notifications.
- Use smooth GSAP motion, including varied ScrollTrigger patterns, to make learning flows feel responsive, polished, and easy to follow.
- Preserve a consistent Japanese editorial identity across tool-like pages and learning pages.

## Tone

- Vietnamese-first, direct, encouraging, and calm.
- Use short labels for controls; avoid long explanatory UI text.
- Use uppercase for section markers, tabs, buttons, and compact metadata when it matches the existing interface.
- Use serif italic copy sparingly for quotations or reflective learning notes.
- Avoid generic SaaS phrases, marketing slogans, and filler copy.

## Existing Product Identity

EasyJapanese currently uses:

- A paper-and-ink visual metaphor: Gofun paper, Sumi ink, Kurenai red.
- Flat, squared surfaces with strong borders and very little border radius.
- Editorial typography: heavy sans headings, Japanese display type for kana/kanji, serif italic supporting copy.
- Structured grids, ruled sections, visible dividers, and table-like kana layouts.
- Lucide icons as functional markers, never as decorative illustrations.
- GSAP as the primary animation system for entrance, transition, reveal, interaction feedback, and scroll-driven storytelling.

## Anti-References

Do not drift into these patterns:

- Generic shadcn SaaS dashboard styling.
- Purple, blue-purple, beige, or dark-slate gradient-heavy UI.
- Rounded, soft, glassy, shadow-heavy cards.
- Marketing hero sections that explain the product instead of showing the learning experience.
- Gamified language-app aesthetics with excessive mascots, badges, rewards, or candy colors.
- Dense enterprise admin UI that makes study feel like office work.

## Decision Principles

- Preserve stable working parts unless a task explicitly targets them.
- Follow existing shadcn/ui components, Tailwind tokens, GSAP, Sonner, and Lucide.
- Prefer GSAP for meaningful UI motion instead of ad hoc CSS animations when sequencing, smoothness, or runtime control matters.
- Use ScrollTrigger as a core enhancement for learning journeys, but only where it improves orientation, rhythm, or comprehension.
- New UI should be reusable and split into small components.
- Every async action needs visible loading, success, error, warning, or info feedback.
- Every state needs a clear loading, error, empty, and completed presentation.
- Prefer clarity and spacing over decoration.
- Do not use browser `alert`, `confirm`, `prompt`, or default notifications.
- Do not introduce gradients unless the user explicitly requests them.
- Do not make product or design decisions without user confirmation when requirements are unclear.
