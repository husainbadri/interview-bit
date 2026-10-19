# Campus OS Huly Theme Migration Tasks

## Phase 1 — Global Fonts & Tokens
- [x] Load `Sora` display font in `app/layout.tsx`
- [x] Configure `app/globals.css` with Huly color palette, custom gradients, and theme settings
- [x] Replace `margin: 0` resetting and adjust font family variables mapping

## Phase 2 — Navbar & Hero
- [x] Refactor `components/landing/Navbar.tsx` for Huly navigation layout and pill controls
- [x] Refactor `components/landing/HeroSection.tsx` for vertical aurora beam and display headings with tight tracking

## Phase 3 — Landing Sections
- [x] Refactor `components/landing/FeaturesSection.tsx` for light/linen background and Huly feature cards
- [x] Refactor `components/landing/HowItWorksSection.tsx` for obsidian-canvas and pill step badges
- [x] Refactor `components/landing/QuestionsPreviewSection.tsx` for linen section and Huly tag chips (12% opacity bg)
- [x] Refactor `components/landing/MissionSection.tsx` for obsidian-canvas with quote design
- [x] Refactor `components/landing/FAQSection.tsx` for linen layout
- [x] Refactor `components/landing/Footer.tsx` for Huly brand and copyright colors

## Phase 4 — Login & Auth Pages
- [x] Refactor `app/login/page.tsx` for Huly card design and login buttons

## Phase 5 — Build Verification
- [x] Run `npm run build` to verify there are no compilation errors
