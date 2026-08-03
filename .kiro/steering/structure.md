---
inclusion: always
---

# Project Structure

## Architecture Pattern

Next.js App Router with clear separation between client and server code.

## Directory Organization

### `/src/app`
Next.js App Router pages and API routes following file-based routing.

- `/[username]` - Dynamic public review pages
- `/actions` - Server Actions for form submissions and mutations
- `/api` - REST API endpoints (login, signout, custom link validation)
- `/auth` - Authentication pages (login, signup, reset)
- `/blog` - Blog with dynamic routes
- `/legal` - Privacy policy and terms pages
- `/main` - Protected dashboard area (dashboard, setup, update)

### `/src/components`
Reusable React components with co-located SCSS modules.

### `/src/lib`
Core business logic and utilities:

- `/db` - Database access layer (Mongoose models and queries)
- `/firebase` - Firebase client and admin configurations
- `/models` - TypeScript types and Mongoose schemas
  - `/client` - Client-side types
  - `/server` - Server-side schemas (marked with "server-only")
- `/services` - Business logic (auth, middleware, username validation)

### `/public`
Static assets (images, icons)

## Code Organization Conventions

### Server vs Client Code

- Server-only code uses `"server-only"` import at the top
- Server Actions use `"use server"` directive
- Client components use `"use client"` directive
- Database models and Firebase Admin are server-only

### Styling

- SCSS Modules for component-specific styles (`.module.scss`)
- Global styles in `app/globals.scss`
- CSS variables in `app/variables.module.scss`
- MUI theme in `app/theme.ts`

### Data Flow

- Server Actions in `/app/actions` for mutations
- Database queries in `/lib/db` layer
- Type definitions in `/lib/models`
- Middleware checks in `/lib/services/middleware.ts`

### Naming Conventions

- Components: PascalCase (e.g., `Header.tsx`)
- Files: camelCase (e.g., `publishReview.ts`)
- SCSS modules: kebab-case with `.module.scss` suffix
- Server Actions: prefix with `on` (e.g., `onPublishReviewSwitch`)

## Key Patterns

- Authentication checked via `checkAuth()` middleware in Server Actions
- Database connection via `dbConnect()` before queries
- Path revalidation after mutations: `revalidatePath('/', 'layout')`
- Redirects for unauthorized access: `redirect('/auth/login')`
- Type formatting functions (e.g., `formatUser()`) to clean DB objects
