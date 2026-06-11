# Saraswata Niketanam — Next.js CMS

Modern full-stack migration of the legacy CodeIgniter 3 CMS.

**Legacy project is untouched.** This app lives in a separate folder and uses copied media assets plus the same MySQL schema.

## Stack

- Next.js 16 (App Router)
- TypeScript
- MySQL via mysql2 (WAMP)
- Auth.js (NextAuth v5) — credentials + legacy MD5 passwords
- Tailwind CSS + Server Actions
- Prisma schema (documentation; runtime uses mysql2)

## Local setup (WAMP)

### 1. Start WAMP — MySQL must be running

### 2. Import database

```powershell
cd saraswata-nextjs
npm run db:import
```

Or use WAMP MySQL console — see previous README section.

### 3. Environment

```
DATABASE_URL="mysql://root:@localhost:3306/saraswat_db"
AUTH_SECRET="your-long-random-secret"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Run

```powershell
cd saraswata-nextjs
npm install
npm run dev
```

- **Website:** http://localhost:3000
- **Admin:** http://localhost:3000/admin/login

Login with your legacy admin email + password from the `users` table.

## Public routes

| URL | Description |
|-----|-------------|
| `/` | Home |
| `/posts`, `/posts/{category}` | Posts listing |
| `/{post-slug}` | Single post |
| `/gallery`, `/gallery/view/{slug}` | Gallery |
| `/videos`, `/videos/view/{slug}` | Videos |
| `/page/{slug}` | CMS pages |
| `/search?q=term` | Search |

## Admin routes

| URL | Description |
|-----|-------------|
| `/admin/login` | Login |
| `/admin/dashboard` | Dashboard stats |
| `/admin/posts` | Posts CRUD |
| `/admin/pages` | Pages CRUD |
| `/admin/gallery` | Gallery CRUD |
| `/admin/videos` | Videos CRUD |
| `/admin/menu` | Menu management |
| `/admin/sliders` | Slider management |
| `/admin/settings` | Site settings |
| `/admin/users` | User management |
| `/admin/profile` | Your profile |
| `/admin/trash` | Restore / delete trashed items |
| `/admin/backup` | Backup instructions + data fixes |

## Migration status

- [x] Phase 0 — Scaffold, assets, design tokens
- [x] Phase 1 — Public layout + home
- [x] Phase 2 — Public pages (posts, gallery, videos, pages, search)
- [x] Phase 3 — Admin panel + Auth.js + CRUD + categories + uploads + settings
- [ ] Phase 4 — Production QA & cutover

## Design tokens

| Token | Color |
|-------|-------|
| Primary | `#1B3A4B` |
| Secondary | `#F5F0E8` |
| Accent | `#C8A951` |
