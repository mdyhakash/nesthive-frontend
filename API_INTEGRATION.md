# API_INTEGRATION.md

Maps every NestHive frontend page, component, and custom hook to the backend endpoint(s) it consumes. Base URL is configured via `NEXT_PUBLIC_API_URL` in `.env.local` (default: `https://nesthive-backend.vercel.app/api/v1`). All authenticated requests attach the `Authorization: Bearer <accessToken>` header automatically via the centralized Axios client interceptor in `src/api/client.ts`.

---

## 🔐 Auth & Account Management

| Frontend Route / Component | Hook / Service | Method & Endpoint | Payload / Query Params | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `/register` | `useRegisterMutation` | `POST /auth/register` | Body: `{ name, email, password, phone }` | Registers user; triggers 6-digit OTP email |
| `/login` | `useLoginMutation` | `POST /auth/login` | Body: `{ email, password }` | Returns `{ accessToken, refreshToken }`; sets cookies & localStorage |
| `/login` | `useLoginMutation` | `GET /auth/me` | — | Immediately fetches fresh profile after login to resolve role |
| `/verify-email` | `useVerifyEmailMutation` | `POST /auth/verify-email` | Body: `{ email, otp }` | Verifies account and activates login session |
| `/forgot-password` | `useForgotPasswordMutation`| `POST /auth/forgot-password` | Body: `{ email }` | Dispatches password reset OTP |
| `/reset-password` | `useResetPasswordMutation` | `POST /auth/reset-password` | Body: `{ email, otp, newPassword }` | Resets account password |
| `src/proxy.ts` (All protected routes) | — | Server Cookie Inspection | Reads `nesthive.token` & `nesthive.role` | Evaluated server-side at edge before request resolution |
| `/admin/profile`, `/owner/profile`, `/tenant/profile` | `useUserProfile` | `GET /user/profile` | — | Loads user profile details |
| Profile edit form | `useUpdateProfileMutation` | `PATCH /user/profile` | Body: `{ name, phone, address, ... }` | Updates profile metadata |

---

## 🌐 Public — Property & Room Discovery

| Frontend Route / Component | Hook / Service | Method & Endpoint | Query Params / Body | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `/` (Featured Section) | `useProperties` | `GET /property` | `limit=6&sortBy=createdAt&sortOrder=desc` | Shows verified, available rooms on homepage |
| `/browse` | `useBrowse` → `useProperties` | `GET /property` | `searchTerm, city, area, type, minRent, maxRent, page, limit, sortBy, sortOrder` | URL search params synchronized; server-filtered |
| `/browse/[id]` | `getPropertyDetails` | `GET /property/:id` | Route param: `:id` | Fetches property details, rooms, and owner bio |
| `/browse/[id]/rooms/[roomId]` | `fetchLiveRoomDetails` | `GET /property/:id` | Route param: `:id`, `:roomId` | Fetches specific room specifications and sibling rooms |
| Room booking modal | `useCreateViewingMutation` | `POST /viewing-request/room/:roomId` | Body: `{ preferredDate, preferredSlot, message }` | Submits in-person viewing schedule request |
| Room application modal | `useCreateApplicationMutation` | `POST /application` | Body: `{ roomId, proposedStartDate, durationMonths, message, ... }` | Submits tenant rental application |

---

## 👤 Tenant (Customer) — Dashboard, Leases, Payments & Maintenance

| Frontend Route / Component | Hook / Service | Method & Endpoint | Payload / Query Params | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `/tenant` (Dashboard Overview) | `useTenantPortal` | `GET /lease/my-leases` | — | Resolves active lease, monthly dues, and rent calendar |
| `/tenant/lease` | `useTenantPortal` | `GET /lease/my-leases` | — | Fetches active lease agreement, security deposit & house rules |
| `/tenant/lease` (Terminate) | `terminateLeaseMutation` | `PATCH /lease/:id/terminate` | Body: `{ reason }` | Submits 30-day lease termination notice |
| `/tenant/viewings` | `useTenantPortal` | `GET /viewing-request/my-requests` | — | Lists tenant's scheduled visits (`PENDING`, `CONFIRMED`, `DECLINED`) |
| `/tenant/viewings` (Cancel) | `cancelViewingMutation` | `PATCH /viewing-request/:id/cancel` | — | Cancels an unconfirmed viewing request |
| `/tenant/applications` | `useTenantPortal` | `GET /application/my-applications` | — | Tracks application status (`PENDING`, `APPROVED`, `REJECTED`, `WITHDRAWN`) |
| `/tenant/applications` (Withdraw)| `withdrawApplicationMutation` | `PATCH /application/:id/withdraw` | — | Withdraws pending application |
| `/tenant/payments` | `useTenantPayments` | `GET /payment/my-payments` | — | Fetches rent, deposit, and utility transaction history |
| Pay Rent / Deposit (Initiate) | `useInitiateRentMutation` | `POST /payment/initiate-rent` | Body: `{ amount, leaseId, paymentMethod }` | Generates payment session |
| Pay Rent / Deposit (Confirm) | `useConfirmRentMutation` | `POST /payment/confirm-rent` | Body: `{ paymentId, transactionId, paymentMethod }` | Confirms transaction and updates ledger |
| `/tenant/maintenance` | `useTenantPortal` | `GET /maintenance/my-requests` | — | Lists tenant maintenance tickets |
| `/tenant/maintenance/new` | `useCreateMaintenanceMutation`| `POST /maintenance` | Body: `{ roomId, category, title, description, priority, imageUrl }` | Submits issue ticket with photo |
| `/payment/success`, `/payment/cancel` | — | Client Route | `?tran_id=&amount=&type=&method=` | Payment gateway redirect targets; printable receipts |

---

## 🏠 Owner (Provider) — Properties, Rooms, Leases & Tenant Requests

| Frontend Route / Component | Hook / Service | Method & Endpoint | Payload / Query Params | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `/owner` (Dashboard Overview) | `useOwnerPortal` | `GET /property/my-properties` | — | Computes property count, room occupancy, and active leases |
| `/owner/properties` | `useMyProperties` | `GET /property/my-properties` | `page, limit, searchTerm, status` | Lists owner properties with draft/publish status |
| `/owner/properties/new` | `useCreatePropertyMutation` | `POST /property` | Body: `{ title, type, description, address, city, area, amenities, images }` | 4-step wizard creation |
| Edit property | `useUpdatePropertyMutation` | `PATCH /property/:id` | Body: `Partial<CreatePropertyPayload>` | Updates property attributes |
| Publish / Unpublish property | `usePublishPropertyMutation` | `PATCH /property/:id/publish` | — | Toggles property visibility on public browse |
| Delete property | `useDeletePropertyMutation` | `DELETE /property/:id` | — | Soft-deletes property |
| `/owner/properties/[id]/rooms` | `useRoomsForProperty` | `GET /room/property/:propertyId` | Route param: `:propertyId` | Lists rooms for a specific property |
| Add Room | `useCreateRoomMutation` | `POST /room` | Body: `{ propertyId, roomNumber, roomType, rentAmount, capacity, sizeSqft, ... }` | Adds individual room unit |
| Edit Room | `useUpdateRoomMutation` | `PATCH /room/:id` | Body: `Partial<RoomPayload>` | Updates room pricing/capacity |
| `/owner/applications` | `useOwnerPortal` | `GET /application/property/:propertyId` | — | Incoming tenant applications for owner's properties |
| Approve / Reject application | `updateAppStatusMutation` | `PATCH /application/:id/status` | Body: `{ status: "APPROVED" \| "REJECTED" }` | Approving application automatically prompts lease creation |
| `/owner/viewings` | `useOwnerPortal` | `GET /viewing-request/room/:roomId` | — | Lists prospective tenant viewing appointments |
| Confirm / Decline viewing | `updateViewingStatusMutation` | `PATCH /viewing-request/:id/status` | Body: `{ status: "CONFIRMED" \| "DECLINED" \| "COMPLETED" }` | Updates visit status |
| `/owner/kyc` | `useUserProfile` | `GET /user/profile` | — | Checks NID and proof-of-ownership review status |
| `/owner/payments` | `useOwnerPayments` | `GET /payment/owner-payments` | — | Aggregates collected rental income across properties |

---

## 🛡️ Admin — Platform Moderation & Analytics

| Frontend Route / Component | Hook / Service | Method & Endpoint | Payload / Query Params | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `/admin` (Platform Overview) | `useAdminOverview` | `GET /admin/overview` | — | Platform KPIs: users, properties, active leases, pending KYC |
| `/admin/users` | `useAllOwners` & `useAllTenants` | `GET /owner` & `GET /tenant` | `page, limit, searchTerm` | Merged platform user directory |
| Block / Unblock User | `useUpdateUserStatusMutation` | `PATCH /admin/user/:userId/status` | Body: `{ status: "ACTIVE" \| "BLOCKED" }` | Toggles user access across platform |
| `/admin/kyc` | `useAllOwners` | `GET /admin/kyc/pending` (or `/owner`) | — | Pending owner identity verification requests |
| Approve / Reject KYC | `useUpdateKycStatusMutation` | `PATCH /admin/kyc/:ownerId` | Body: `{ status: "APPROVED" \| "REJECTED", rejectReason }` | Unlocks property publishing upon approval |
| `/admin/leases` | `useAdminLeases` | `GET /lease` | — | Global lease oversight across all owners and tenants |
| `/admin/payments` | `useAdminPayments` | `GET /payment` | — | Platform-wide financial audit trail |
| `/admin/maintenance` | `useAdminMaintenance` | `GET /maintenance` | — | Cross-platform maintenance ticket queue |
| `/admin/audit` | `useAdminAuditLogs` | `GET /admin/audit-logs` | `page, limit` | Paginated system action logs and actor footprints |

---

## 🔄 Cross-Cutting Concerns

| Concern | Implementation Strategy |
| :--- | :--- |
| **Authentication & Tokens** | JWT access and refresh tokens stored in `localStorage` and `nesthive.token`/`nesthive.role` cookies. Attached to API calls via Axios interceptors. |
| **Route Protection (Next.js 16)** | `src/proxy.ts` evaluates incoming requests server-side. Unauthenticated users are redirected to `/login?redirect=...`; users accessing unauthorized dashboards are redirected to their designated role dashboard. |
| **Caching & Invalidation** | **TanStack Query v5** manages client-side caching. Query key hierarchies (`PROPERTY_KEYS`, `TENANT_PORTAL_KEYS`, `OWNER_PORTAL_KEYS`, `ADMIN_KEYS`) ensure selective cache invalidation upon mutations. |
| **Form Standards** | All inputs validated client-side using **React Hook Form + Zod** schemas (`src/lib/validation.ts`) matching backend validation rules before API submission. |
| **Payment Flow** | Dual payment gateway support (bKash & SSLCommerz / Stripe Test Mode) with redirect parameters processed by `/payment/success` and `/payment/cancel`. |

