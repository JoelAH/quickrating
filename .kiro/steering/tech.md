---
inclusion: always
---

# Tech Stack

## Framework & Core

- Next.js 14.2.5 (App Router)
- React 18
- TypeScript 5 (strict mode enabled)
- Node.js 20+

## UI & Styling

- Material-UI (MUI) v5 with Emotion styling
- SCSS Modules for custom styles
- Lato font (Google Fonts via next/font)
- Responsive design (mobile + desktop)

## Backend & Data

- MongoDB with Mongoose ODM
- Firebase (Authentication + Storage + Analytics)
- Firebase Admin SDK for server-side operations

## Key Libraries

- `server-only` package for server-side code protection
- `react-toastify` for notifications
- `dayjs` for date handling
- `sharp` for image optimization
- `fakefilter` for content moderation

## Common Commands

```bash
# Development (with Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Environment Variables

Required in `.env.local`:
- Firebase config (NEXT_PUBLIC_FIREBASE_*)
- MongoDB URI (DB_URI)
- Firebase Admin credentials

## Path Aliases

- `@/*` maps to `./src/*` for clean imports
