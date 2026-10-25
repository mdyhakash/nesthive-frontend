import type { AuditLog } from "@/types";

export const auditLogs: AuditLog[] = [
  { id: "al-1", actorId: "u-a1", actorName: "Tahmina Akter", actorRole: "ADMIN", action: "APPROVE", entity: "Owner", entityId: "o-1", summary: "Approved KYC for Kamal Uddin", timestamp: "2026-01-25T12:30:00Z" },
  { id: "al-2", actorId: "u-o1", actorName: "Kamal Uddin", actorRole: "OWNER", action: "PUBLISH", entity: "Property", entityId: "p-11", summary: "Published Road 11 Executive Rooms", timestamp: "2026-09-02T10:00:00Z" },
  { id: "al-3", actorId: "u-t1", actorName: "Rafiq Ahmed", actorRole: "TENANT", action: "CREATE", entity: "Application", entityId: "a-1", summary: "Applied for Room 2 at DOHS Mirpur Sunrise Flat", timestamp: "2026-10-20T10:00:00Z" },
  { id: "al-4", actorId: "u-o1", actorName: "Kamal Uddin", actorRole: "OWNER", action: "REJECT", entity: "ViewingRequest", entityId: "v-3", summary: "Rejected viewing request v-3", timestamp: "2026-10-12T09:00:00Z" },
  { id: "al-5", actorId: "u-t1", actorName: "Rafiq Ahmed", actorRole: "TENANT", action: "PAYMENT", entity: "Payment", entityId: "pay-5", summary: "Paid ৳12,500 rent via bKash", timestamp: "2026-10-05T07:50:00Z" },
  { id: "al-6", actorId: "u-a1", actorName: "Tahmina Akter", actorRole: "ADMIN", action: "BLOCK", entity: "User", entityId: "u-t4", summary: "Blocked Sadia Islam for repeated failed payments", timestamp: "2026-09-02T10:00:00Z" },
  { id: "al-7", actorId: "u-a1", actorName: "Tahmina Akter", actorRole: "ADMIN", action: "REJECT", entity: "Owner", entityId: "o-3", summary: "Rejected KYC for Anwar Hossain: unclear documents", timestamp: "2026-10-08T11:00:00Z" },
  { id: "al-8", actorId: "u-o1", actorName: "Kamal Uddin", actorRole: "OWNER", action: "CREATE", entity: "UtilityBill", entityId: "ub-1", summary: "Created electricity bill for Green Nest, Oct 2026", timestamp: "2026-10-15T09:00:00Z" },
  { id: "al-9", actorId: "u-m1", actorName: "Habibur Rahman", actorRole: "MANAGER", action: "UPDATE", entity: "MaintenanceTicket", entityId: "t-1", summary: "Moved ticket t-1 to In progress", timestamp: "2026-10-20T10:00:00Z" },
  { id: "al-10", actorId: "u-o1", actorName: "Kamal Uddin", actorRole: "OWNER", action: "DELETE", entity: "Property", entityId: "p-12", summary: "Soft-deleted Block C Co-living", timestamp: "2026-10-01T08:00:00Z" },
  { id: "al-11", actorId: "u-o1", actorName: "Kamal Uddin", actorRole: "OWNER", action: "APPROVE", entity: "Application", entityId: "a-10", summary: "Approved application a-10", timestamp: "2026-07-12T09:00:00Z" },
  { id: "al-12", actorId: "u-t3", actorName: "Tanvir Hasan", actorRole: "TENANT", action: "LOGIN", entity: "User", entityId: "u-t3", summary: "Signed in from Chrome on Android", timestamp: "2026-10-19T07:20:00Z" },
  { id: "al-13", actorId: "u-a1", actorName: "Tahmina Akter", actorRole: "ADMIN", action: "UNBLOCK", entity: "User", entityId: "u-t7", summary: "Unblocked Mahmudul Karim after review", timestamp: "2026-09-10T14:00:00Z" },
  { id: "al-14", actorId: "u-t2", actorName: "Nusrat Jahan", actorRole: "TENANT", action: "CREATE", entity: "MaintenanceTicket", entityId: "t-6", summary: "Opened ticket: Wi-Fi router keeps restarting", timestamp: "2026-10-09T09:30:00Z" },
  { id: "al-15", actorId: "u-o1", actorName: "Kamal Uddin", actorRole: "OWNER", action: "UPDATE", entity: "Room", entityId: "r-6", summary: "Updated price for Room 3 to ৳13,500", timestamp: "2026-10-03T16:00:00Z" },
  { id: "al-16", actorId: "u-o2", actorName: "Shirin Akter", actorRole: "OWNER", action: "CREATE", entity: "Owner", entityId: "o-2", summary: "Submitted KYC documents", timestamp: "2026-10-19T09:15:00Z" },
  { id: "al-17", actorId: "u-t7", actorName: "Mahmudul Karim", actorRole: "TENANT", action: "PAYMENT", entity: "Payment", entityId: "pay-16", summary: "Paid ৳28,000 rent via bKash", timestamp: "2026-10-02T08:00:00Z" },
  { id: "al-18", actorId: "u-t1", actorName: "Rafiq Ahmed", actorRole: "TENANT", action: "CREATE", entity: "Lease", entityId: "l-1", summary: "Lease l-1 started for Green Nest, Room 1", timestamp: "2026-03-01T09:00:00Z" },
];
