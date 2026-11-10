# 🏠 NestHive — Frontend

Find your room. Find your people. A Next.js frontend for a three-sided housing & roommate platform — tenants browse verified listings, apply for rooms, and split utilities; owners list properties, review tenant applications, and collect rent; admins oversee KYC verification, user moderation, and audit logs.

Live: `https://nesthive-frontend.vercel.app/` · Backend: `https://nesthive-backend.vercel.app/api/v1` · API Docs: `https://nesthive-backend.vercel.app/api-docs`

---

## Screenshots

*(Place application dashboard and browse screenshots here)*

---

## Tech Stack

- **Next.js 16** — App Router, Server Components, `proxy.ts` for edge-level auth & RBAC (Next.js 16's official successor to `middleware.ts`)
- **TypeScript**
- **Tailwind CSS v4** + shadcn/ui (Radix primitives)
- **TanStack Query (React Query v5)** + **Zustand** — Server state caching, optimistic updates, and persistent auth session (`localStorage` + cookies)
- **React Hook Form + Zod** — Type-safe client validation and multi-step creation wizard (`PropertyForm`)
- **Recharts** — Interactive platform analytics, occupancy rates, and revenue distribution charts
- **JWT Auth & Cookies** — Access token in Bearer header and `nesthive.token`/`nesthive.role` cookies for SSR route protection in `proxy.ts`
- **bKash & SSLCommerz / Stripe Test Mode** — Mobile banking & card checkout with `/payment/success` and `/payment/cancel` redirect targets

---

## Getting Started

### 1. Install

```bash
npm install
```

### 2. Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=https://nesthive-backend.vercel.app/api/v1
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Demo Credentials (1-Click Login Ready)

The `/login` page features distinct, one-click "Demo Login" buttons for each role:

| Role | Email | Password | Dashboard Redirect |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `Admin123@` | `/admin` |
| **Owner (Provider)** | `owner@gmail.com` | `Owner123@` | `/owner` |
| **Tenant (User)** | `tenant@gmail.com` | `Tenant123@` | `/tenant` |
| **Manager (Staff)** | `manager@gmail.com` | `Manager123@` | `/manager` |

---

## Roles

| Role | Dashboard | Can do |
| :--- | :--- | :--- |
| **Tenant (Customer)** | `/tenant` | Browse & search rooms, schedule viewings, submit rental applications, digitally manage leases, pay rent/deposits with bKash/SSLCommerz, split utilities, submit maintenance tickets, roommate matching |
| **Owner (Provider)** | `/owner` | Create & manage properties via multi-step wizard, manage rooms & pricing, review viewing requests, approve/reject tenant applications, generate utility split bills, submit KYC identity documents |
| **Admin** | `/admin` | Platform overview & metrics (Recharts), verify/reject owner KYC documents, activate/block users, oversee all platform leases, monitor transactions, review platform maintenance queue & audit logs |
| **Manager (Staff)** | `/manager` | Manage assigned properties, resolve maintenance requests, coordinate room occupancies |

Role access is strictly enforced by `src/proxy.ts`: unauthenticated visitors to protected routes are redirected to `/login?redirect=...`; authenticated users visiting a route belonging to another role are redirected to their own role dashboard.

---

## Project Structure

```
src/
├── api/                   — Axios service modules (client.ts, auth.api.ts, property.api.ts, lease.api.ts, etc.)
├── app/
│   ├── (auth)/            — /login (with 1-Click Demo Login), /register, /verify-email, /forgot-password, /reset-password
│   ├── (marketing)/       — /, /about, /browse, /browse/[id], /browse/[id]/rooms/[roomId], /contact, /faq, /for-owners, /for-tenants, /how-it-works
│   ├── (portal)/
│   │   ├── admin/         — admin: overview, users, kyc, leases, payments, maintenance, audit, profile
│   │   ├── owner/         — owner: overview, properties, new property wizard, rooms, applications, viewings, utilities, managers, kyc, payments
│   │   ├── tenant/        — tenant: overview, lease, viewings, applications, payments, utilities, maintenance, roommates, notifications
│   │   └── manager/       — manager: overview, properties, maintenance, profile
│   ├── payment/           — /payment/success, /payment/cancel (Gateway redirect targets with receipt print)
│   ├── not-found.tsx      — Custom 404 page
│   ├── error.tsx          — Global error boundary ("use client")
│   └── loading.tsx        — Global skeleton loader
├── components/
│   ├── auth/              — login form with 1-click demo buttons, registration, password inputs, otp input
│   ├── marketing/         — hero, featured properties, search filters, testimonials, bento grid
│   ├── portal/            — role switcher, topbar, sidebar, property form wizard, bkash checkout modal, chart cards
│   ├── shared/            — data table, property card, room card, confirm dialog, empty state, pagination
│   └── ui/                — button, dialog, input, select, badge, progress, skeleton, sonner toast
├── hooks/                 — Custom hooks (useProperties, useBrowse, useTenantPortal, useOwnerPortal, useAdmin, usePayment, etc.)
├── store/                 — Zustand global state (auth.store.ts with localStorage & cookie persistence)
├── proxy.ts               — Next.js 16 Server-side route protection & RBAC middleware
└── types/                 — Domain interfaces & TypeScript definitions
```

---

## Key Flows

**Tenant (Customer) Rental Flow:**
Browse/filter rooms by area/budget (`/browse`) → inspect room & property details (`/browse/[id]/rooms/[roomId]`) → request a viewing slot (`PENDING`) → owner approves viewing (`CONFIRMED`) → submit rental application with move-in date (`SUBMITTED`) → owner approves application (`APPROVED`) → digital lease created (`ACTIVE`) → pay deposit & monthly rent via bKash or SSLCommerz/Stripe Test Mode → redirected to `/payment/success` with receipt → submit maintenance tickets or split monthly utilities.

**Owner (Provider) Listing & Management Flow:**
Complete KYC document submission (`/owner/kyc`) → once verified by admin, create listing via 4-step wizard (`/owner/properties/new`) → add individual rooms and set capacities/pricing (`/owner/properties/[id]/rooms`) → publish listing live to `/browse` → receive incoming viewing requests & applications → approve qualified tenants → monitor monthly income & active leases.

**Admin Platform Moderation Flow:**
Review platform analytics & growth charts (`/admin`) → inspect pending KYC submissions with NID & ownership deed previews (`/admin/kyc`) → approve or reject KYC with reason → manage user statuses (`ACTIVE` / `BLOCKED`) (`/admin/users`) → audit all system operations and transaction trails (`/admin/audit`).

---

## Design Notes / Known Constraints

- **Next.js 16 `proxy.ts` Architecture.** Next.js 16 formally renamed `middleware.ts` to `proxy.ts`. Route security, cookie parsing (`nesthive.token`, `nesthive.role`), and RBAC redirects happen server-side at the edge.
- **Double Payment Gateway Support.** Fully implements the bKash checkout flow alongside SSLCommerz / Stripe Test Mode options. Successful transactions route to `/payment/success` (printable receipt with transaction ID); aborted transactions route to `/payment/cancel`.
- **Decoupled Architecture with TanStack Query.** Components remain purely presentational. All asynchronous queries, mutations, query key invalidations, and optimistic states live inside custom hooks (`src/hooks/`).
- **Multi-Step Creation Wizard.** Property listing uses a 4-step React Hook Form + Zod wizard (`Basic info` ➔ `Location` ➔ `Images` ➔ `Amenities`) with client-side validation per step.
- **URL State Synchronization.** Filtering, search terms, and pagination on `/browse` synchronize bi-directionally with URL query parameters (`useSearchParams`) for bookmarkable and shareable views.

---

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Run production server
npm run lint      # Run ESLint
npm run typecheck # Run TypeScript compiler check
```
