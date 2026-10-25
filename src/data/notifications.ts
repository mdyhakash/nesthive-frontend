import type { Notification } from "@/types";

export const notifications: Notification[] = [
  // Tenant (Rafiq)
  { id: "n-1", userId: "u-t1", kind: "VIEWING", title: "Viewing approved", body: "Your visit to Road 11 Executive Rooms is confirmed for 24 Oct, 11:00 AM.", read: false, createdAt: "2026-10-21T15:00:00Z", href: "/tenant/viewings" },
  { id: "n-2", userId: "u-t1", kind: "UTILITY", title: "New utility split", body: "Your share of October electricity is ৳2,200. Due 28 Oct.", read: false, createdAt: "2026-10-15T09:10:00Z", href: "/tenant/utilities" },
  { id: "n-3", userId: "u-t1", kind: "MAINTENANCE", title: "Ticket updated", body: "Your bathroom tap ticket is now in progress.", read: false, createdAt: "2026-10-20T10:00:00Z", href: "/tenant/maintenance/t-1" },
  { id: "n-4", userId: "u-t1", kind: "PAYMENT", title: "Rent payment received", body: "We received ৳12,500 for October 2026. Thank you!", read: true, createdAt: "2026-10-05T07:51:00Z", href: "/tenant/payments" },
  { id: "n-5", userId: "u-t1", kind: "APPLICATION", title: "Application update", body: "Your sublet application at Satmasjid Road was not approved.", read: true, createdAt: "2026-10-11T09:31:00Z", href: "/tenant/applications" },
  { id: "n-6", userId: "u-t1", kind: "PAYMENT", title: "Payment failed", body: "Your bKash payment of ৳12,500 didn't go through. Please try again.", read: true, createdAt: "2026-10-04T21:06:00Z", href: "/tenant/payments" },
  { id: "n-7", userId: "u-t1", kind: "SYSTEM", title: "Complete your roommate profile", body: "Answer 8 quick questions to get compatibility matches.", read: true, createdAt: "2026-09-28T09:00:00Z", href: "/tenant/roommates" },
  // Owner (Kamal)
  { id: "n-8", userId: "u-o1", kind: "APPLICATION", title: "New application", body: "Farhana Akter applied for Room 3 at Green Nest, Road 27.", read: false, createdAt: "2026-10-21T19:00:00Z", href: "/owner/applications" },
  { id: "n-9", userId: "u-o1", kind: "VIEWING", title: "Viewing request", body: "Imran Hossain asked to visit Lakeview Shared Flat on 27 Oct.", read: false, createdAt: "2026-10-20T20:05:00Z", href: "/owner/viewings" },
  { id: "n-10", userId: "u-o1", kind: "MAINTENANCE", title: "Urgent ticket", body: "Geyser not heating in Lakeview Shared Flat, Room A.", read: false, createdAt: "2026-10-21T20:00:00Z", href: "/owner/maintenance" },
  { id: "n-11", userId: "u-o1", kind: "PAYMENT", title: "Rent received", body: "Mahmudul Karim paid ৳28,000 for October.", read: true, createdAt: "2026-10-02T08:01:00Z", href: "/owner/payments" },
  { id: "n-12", userId: "u-o1", kind: "KYC", title: "Verification approved", body: "Your KYC is approved. You can publish properties.", read: true, createdAt: "2026-01-25T12:30:00Z", href: "/owner/kyc" },
  { id: "n-13", userId: "u-o1", kind: "LEASE", title: "Lease starting soon", body: "A new lease at Green Nest starts on 1 Nov.", read: true, createdAt: "2026-10-10T09:00:00Z", href: "/owner/leases" },
  // Manager (Habibur)
  { id: "n-14", userId: "u-m1", kind: "MAINTENANCE", title: "New ticket assigned", body: "Ceiling fan wobbles — Green Nest, Room 1.", read: false, createdAt: "2026-10-21T14:00:00Z", href: "/manager/maintenance" },
  { id: "n-15", userId: "u-m1", kind: "MAINTENANCE", title: "Urgent ticket", body: "Geyser not heating — Lakeview Shared Flat.", read: false, createdAt: "2026-10-21T20:00:00Z", href: "/manager/maintenance" },
  { id: "n-16", userId: "u-m1", kind: "SYSTEM", title: "Property assigned", body: "Gulshan 2 Studio Loft was added to your properties.", read: true, createdAt: "2026-09-02T09:00:00Z", href: "/manager/properties" },
  // Admin
  { id: "n-17", userId: "u-a1", kind: "KYC", title: "KYC awaiting review", body: "Shirin Akter submitted documents on 19 Oct.", read: false, createdAt: "2026-10-19T09:20:00Z", href: "/admin/kyc" },
  { id: "n-18", userId: "u-a1", kind: "SYSTEM", title: "New users this week", body: "12 tenants and 2 owners joined this week.", read: false, createdAt: "2026-10-20T06:00:00Z", href: "/admin/users" },
  { id: "n-19", userId: "u-a1", kind: "PAYMENT", title: "Failed payment spike", body: "3 bKash payments failed in the last 24 hours.", read: true, createdAt: "2026-10-18T18:00:00Z", href: "/admin/payments" },
];

export const notificationsForUser = (userId: string) => notifications.filter((n) => n.userId === userId);
