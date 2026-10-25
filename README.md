# NestHive (UI only)

Housing & roommate management platform for renters and owners in Bangladesh.
**This is a front-end-only build.** There are no API calls, no real auth, no env vars and no database.
Everything runs on mock data held in React state, so a page reload resets the demo.

Stack: Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn-style components (Radix) · lucide-react · sonner · framer-motion · next-themes · react-hook-form + zod · recharts.

```bash
npm install --legacy-peer-deps
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

## Demo logins
Open `/login`, pick a role and use the quick-fill buttons (password `demo1234`, email code `123456`).
Inside the portal, the floating flask button switches role and turns on **Show error states**.

| Role | Demo user | Lands on |
|---|---|---|
| Tenant | Rafiq Ahmed | `/tenant` |
| Owner | Kamal Uddin (KYC approved) | `/owner` |
| Manager | Habibur Rahman | `/manager` |
| Admin | Tahmina Akter | `/admin` |

bKash checkout (tenant → Payments): PIN `12345` succeeds, `00000` fails (insufficient balance), OTP `123456`.
To see the "KYC not approved" states, submit new documents as the owner (`/owner/kyc` → Update documents), or reject the owner as admin.

## Routes
**Public:** `/` · `/browse` · `/browse/[id]` · `/browse/[id]/rooms/[roomId]` · `/how-it-works` · `/for-tenants` · `/for-owners` · `/about` · `/contact` · `/faq`
**Auth:** `/login` · `/register` · `/verify-email` · `/forgot-password` · `/reset-password`
**Tenant:** `/tenant` · `/tenant/roommates` · `/tenant/viewings` · `/tenant/applications` · `/tenant/lease` · `/tenant/payments` · `/tenant/utilities` · `/tenant/maintenance` (+ `/new`, `/[id]`) · `/tenant/notifications` · `/tenant/profile`
**Owner:** `/owner` · `/owner/kyc` · `/owner/properties` (+ `/new`, `/[id]/edit`, `/[id]/rooms`) · `/owner/viewings` · `/owner/applications` · `/owner/leases` · `/owner/payments` · `/owner/utilities` · `/owner/maintenance` · `/owner/managers` · `/owner/notifications` · `/owner/profile`
**Manager:** `/manager` · `/manager/properties` · `/manager/maintenance` · `/manager/leases` · `/manager/notifications` · `/manager/profile`
**Admin:** `/admin` · `/admin/kyc` · `/admin/users` · `/admin/payments` · `/admin/leases` · `/admin/maintenance` · `/admin/audit` · `/admin/notifications` · `/admin/profile`

## Where things live
- **Mock data:** `src/data/*.ts` (users, properties, rooms, activity = viewings/applications/leases/payments, utilities, maintenance, notifications, audit, roommates, marketing copy, analytics). Types in `src/types/index.ts`.
- **Live store:** `src/components/data-provider.tsx` copies the seed data into React state so actions (approve, pay, cancel…) show up across pages and roles. `useMockQuery` (`src/hooks/use-mock-query.ts`) gives every list its 600 ms skeleton, empty and error states.
- **Mock auth:** `src/components/auth-provider.tsx` (role in `localStorage` key `nesthive.role`).
- **Portal shell:** `src/components/portal/` (sidebar, top bar, mobile bottom nav, role switcher, bKash checkout, shared record views). Nav per role: `src/lib/nav.ts`.
- **Motion:** `src/lib/motion.ts`, `src/app/template.tsx`, `MotionConfig reducedMotion="user"` in `providers.tsx`.
- **Formatting:** `src/lib/format.ts` (`formatBDT` → ৳18,000 with lakh grouping, Dhaka dates; the mock "now" is 21 Oct 2026).

## Design tokens (`src/app/globals.css`)
Light: background `#FCFCFB`, card `#FFFFFF`, foreground `#16181D`, primary (amber) `#F5A524`, secondary (teal) `#0F766E`. Dark: background `#0B0F14`, card `#131920`, foreground `#EAEDF1`, primary `#FFB84D`, secondary `#2DD4BF`.
Semantic soft/strong pairs for success, warning, danger and info; chart colors `--chart-1…5`; bKash pink (`--bkash`) appears **only** on bKash screens.
Fonts (next/font/google): Plus Jakarta Sans 600/700/800 for headings (-0.02em), Inter 400/500/600 for body, JetBrains Mono for numbers and IDs (`.num`, tabular). Noto Sans Bengali is a fallback so ৳ always renders.
Type scale: hero 36/64, h2 28/40, body 16, small 14, caption 12. Radius 12 / 16 / 24.

## Notes
- Photos come from Unsplash through `next/image`; a tinted fallback shows if one fails to load.
- Admin charts use the brand chart colors; each has a legend, tooltips and a **Table** toggle so values never rely on color alone.
- Uploads (KYC, tickets, property photos, avatar) are previewed locally with object URLs and never sent anywhere.
