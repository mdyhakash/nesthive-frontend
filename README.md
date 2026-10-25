# 🏠 NestHive — Fullstack Housing & Roommate Platform

Modern, fullstack-ready housing and roommate discovery and management platform built with **Next.js (App Router)**, **TanStack Query (React Query)**, **Axios**, **Zustand**, and **Tailwind CSS**. Built according to Programming Hero B7A7 specifications and integrated with the live NestHive Backend API.

---

## 🌟 Live Links & API References

- **Live Backend API**: [https://nesthive-backend.vercel.app/api/v1](https://nesthive-backend.vercel.app/api/v1)
- **API Documentation (Swagger UI)**: [https://nesthive-backend.vercel.app/api-docs](https://nesthive-backend.vercel.app/api-docs)

---

## 🚀 Key Features

- **Decoupled Architecture**: Strict separation of concerns — **zero business logic in components**. All server queries, mutations, filtering and state updates are encapsulated in custom hooks (`src/hooks/`).
- **Data Fetching & Cache Management**: **TanStack Query (React Query v5)** with custom query key factories and cache invalidation.
- **HTTP Client**: Centralized Axios client (`src/api/client.ts`) with Bearer token request interceptor and unified error handling.
- **State Management**: **Zustand** stores (`src/store/auth.store.ts`, `src/store/ui.store.ts`) with `localStorage` persistence.
- **Centralized Route Constants**: Role-based route definitions in `src/routes/` (`public`, `auth`, `tenant`, `owner`, `admin`).
- **Form Validation**: **React Hook Form + Zod** schemas for robust, accessible type-safe validations.
- **One-Click Quick Demo Login**: Instant login buttons for **Admin**, **Owner**, and **Manager** directly executing live API requests with token storage.
- **Multi-Role Portals**: Complete dashboard workflows for Tenant, Property Owner, Manager, and Platform Admin.
- **Fintech Integration**: Full bKash mobile banking checkout simulation for rent, security deposits, and utility bill splits.

---

## 🔑 Demo Credentials (Live API Connected)

| Role | Email | Password | Quick Action |
|:---|:---|:---|:---|
| **Admin** | `admin@gmail.com` | `Admin123@` | 1-Click Demo Button on `/login` |
| **Owner** | `owner@gmail.com` | `Owner123@` | 1-Click Demo Button on `/login` |
| **Manager** | `manager@gmail.com` | `Manager123@` | 1-Click Demo Button on `/login` |
| **Tenant** | Demo session / Register | Any valid password | Sign up or test as renter |

---

## 🏗️ Project Architecture & Folder Structure

Following strict architectural conventions:
```
nesthive-frontend/
├── src/
│   ├── api/                   # File-based API services (Axios client)
│   │   ├── client.ts          # Central Axios instance with interceptors
│   │   ├── auth.api.ts        # Login, register, profile, change password
│   │   ├── user.api.ts        # User query and status updates
│   │   ├── property.api.ts    # Property CRUD, filtering, pagination
│   │   ├── room.api.ts        # Room CRUD and assignment
│   │   ├── viewing.api.ts     # Viewing requests and scheduling
│   │   ├── application.api.ts # Rental applications and approvals
│   │   ├── lease.api.ts       # Tenant and owner leases
│   │   ├── maintenance.api.ts # Maintenance ticket lifecycle
│   │   ├── utility.api.ts     # Utility bills and split payments
│   │   ├── payment.api.ts     # Rent, deposit & bKash transactions
│   │   ├── admin.api.ts       # Platform overview, KYC and audit logs
│   │   └── index.ts           # Unified API export
│   ├── hooks/                 # Custom Hooks (ALL business logic lives here)
│   │   ├── useAuthMutations.ts# Login, registration, password mutations
│   │   ├── useUserProfile.ts  # Current authenticated user profile
│   │   ├── useProperties.ts   # Property TanStack queries & mutations
│   │   ├── useRooms.ts        # Room queries & mutations
│   │   ├── useBrowse.ts       # Discovery, search, filter and pagination
│   │   ├── useTenantPortal.ts # Tenant leases, applications & viewings
│   │   ├── useOwnerPortal.ts  # Owner properties, leases & applications
│   │   ├── useMaintenance.ts  # Maintenance tickets
│   │   ├── usePayment.ts      # Rent & bKash payments
│   │   ├── useAdmin.ts        # Admin overview, KYC approval & user block
│   │   └── index.ts           # Unified hooks export
│   ├── store/                 # Zustand state management
│   │   ├── auth.store.ts      # Authentication tokens and user profile
│   │   ├── ui.store.ts        # Theme, sidebar and drawer states
│   │   └── index.ts
│   ├── providers/             # Global application providers
│   │   ├── query-provider.tsx # TanStack QueryClientProvider & DevTools
│   │   ├── theme-provider.tsx # next-themes Dark/Light mode provider
│   │   └── index.tsx          # Combined root providers wrapper
│   ├── routes/                # Centralized role-based route paths
│   │   ├── public.routes.ts   # Public marketing routes
│   │   ├── auth.routes.ts     # Authentication routes
│   │   ├── tenant.routes.ts   # Tenant portal routes
│   │   ├── owner.routes.ts    # Owner portal routes
│   │   ├── admin.routes.ts    # Admin portal routes
│   │   └── index.ts
│   ├── components/            # Pure presentational UI components
│   │   ├── auth/              # Login, register, verify forms
│   │   ├── marketing/         # Landing, browse and room cards
│   │   ├── portal/            # Sidebar, topbar, maintenance, forms
│   │   ├── shared/            # Data tables, stat cards, empty states
│   │   └── ui/                # Accessible Radix primitives
│   ├── types/                 # TypeScript interfaces and API schemas
│   └── app/                   # Next.js App Router layout and pages
```

---

## 🛠️ Setup & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/mdyhakash/nesthive-frontend.git
cd nesthive-frontend
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://nesthive-backend.vercel.app/api/v1
```

### 3. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Production Build Verification
```bash
npm run build
npm start
```
