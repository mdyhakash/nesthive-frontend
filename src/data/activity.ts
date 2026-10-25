import type { Application, Lease, Payment, ViewingRequest } from "@/types";

/* ------------------------------------------------------------------ */
/* Viewing requests — all four statuses                                */
/* ------------------------------------------------------------------ */
export const viewingRequests: ViewingRequest[] = [
  { id: "v-1", propertyId: "p-10", roomId: "r-20", tenantId: "u-t1", tenantName: "Rafiq Ahmed", date: "2026-10-26", timeSlot: "5:00 PM – 6:00 PM", status: "PENDING", note: "Would like to see the balcony and the kitchen.", createdAt: "2026-10-21T09:10:00Z" },
  { id: "v-2", propertyId: "p-11", roomId: "r-21", tenantId: "u-t1", tenantName: "Rafiq Ahmed", date: "2026-10-24", timeSlot: "11:00 AM – 12:00 PM", status: "APPROVED", createdAt: "2026-10-19T15:00:00Z" },
  { id: "v-3", propertyId: "p-9", roomId: "r-18", tenantId: "u-t1", tenantName: "Rafiq Ahmed", date: "2026-10-14", timeSlot: "3:00 PM – 4:00 PM", status: "REJECTED", rejectReason: "The room was already promised to another tenant for this slot.", createdAt: "2026-10-10T12:00:00Z" },
  { id: "v-4", propertyId: "p-1", roomId: "r-2", tenantId: "u-t1", tenantName: "Rafiq Ahmed", date: "2026-10-12", timeSlot: "10:00 AM – 11:00 AM", status: "CANCELLED", createdAt: "2026-10-08T08:20:00Z" },
  { id: "v-5", propertyId: "p-2", roomId: "r-6", tenantId: "u-t6", tenantName: "Farhana Akter", date: "2026-10-25", timeSlot: "4:00 PM – 5:00 PM", status: "PENDING", note: "Visiting with my friend, 2 people.", createdAt: "2026-10-21T18:40:00Z" },
  { id: "v-6", propertyId: "p-1", roomId: "r-2", tenantId: "u-t5", tenantName: "Imran Hossain", date: "2026-10-27", timeSlot: "6:00 PM – 7:00 PM", status: "PENDING", createdAt: "2026-10-20T20:05:00Z" },
  { id: "v-7", propertyId: "p-3", roomId: "r-9", tenantId: "u-t2", tenantName: "Nusrat Jahan", date: "2026-10-23", timeSlot: "9:00 AM – 10:00 AM", status: "APPROVED", createdAt: "2026-10-18T07:30:00Z" },
  { id: "v-8", propertyId: "p-5", tenantId: "u-t3", tenantName: "Tanvir Hasan", date: "2026-10-09", timeSlot: "2:00 PM – 3:00 PM", status: "APPROVED", createdAt: "2026-10-04T10:10:00Z" },
  { id: "v-9", propertyId: "p-10", roomId: "r-19", tenantId: "u-t7", tenantName: "Mahmudul Karim", date: "2026-10-15", timeSlot: "7:00 PM – 8:00 PM", status: "REJECTED", rejectReason: "Evening visits are not available this week. Please pick a daytime slot.", createdAt: "2026-10-11T16:45:00Z" },
  { id: "v-10", propertyId: "p-11", roomId: "r-21", tenantId: "u-t6", tenantName: "Farhana Akter", date: "2026-10-18", timeSlot: "1:00 PM – 2:00 PM", status: "CANCELLED", createdAt: "2026-10-13T09:00:00Z" },
];

/* ------------------------------------------------------------------ */
/* Applications — all four statuses                                    */
/* ------------------------------------------------------------------ */
export const applications: Application[] = [
  { id: "a-1", propertyId: "p-10", roomId: "r-20", tenantId: "u-t1", tenantName: "Rafiq Ahmed", status: "PENDING", message: "I work hybrid and prefer a quiet household. Can move in from 1 December.", moveInDate: "2026-12-01", createdAt: "2026-10-20T10:00:00Z", updatedAt: "2026-10-20T10:00:00Z" },
  { id: "a-2", propertyId: "p-2", roomId: "r-4", tenantId: "u-t1", tenantName: "Rafiq Ahmed", status: "APPROVED", message: "Interested in the sunroom. Available from 1 March.", moveInDate: "2026-03-01", createdAt: "2026-02-20T09:00:00Z", updatedAt: "2026-02-22T13:00:00Z" },
  { id: "a-3", propertyId: "p-9", roomId: "r-18", tenantId: "u-t1", tenantName: "Rafiq Ahmed", status: "REJECTED", message: "Looking for a three-month sublet.", moveInDate: "2026-11-15", rejectReason: "We are looking for a longer commitment than three months for this room.", createdAt: "2026-10-09T11:00:00Z", updatedAt: "2026-10-11T09:30:00Z" },
  { id: "a-4", propertyId: "p-1", roomId: "r-2", tenantId: "u-t1", tenantName: "Rafiq Ahmed", status: "WITHDRAWN", message: "Applying for Room B.", moveInDate: "2026-11-01", createdAt: "2026-10-05T08:00:00Z", updatedAt: "2026-10-07T17:20:00Z" },
  { id: "a-5", propertyId: "p-2", roomId: "r-6", tenantId: "u-t6", tenantName: "Farhana Akter", status: "PENDING", message: "UI designer, work from home most days. Non-smoker.", moveInDate: "2026-11-10", createdAt: "2026-10-21T19:00:00Z", updatedAt: "2026-10-21T19:00:00Z" },
  { id: "a-6", propertyId: "p-1", roomId: "r-2", tenantId: "u-t5", tenantName: "Imran Hossain", status: "PENDING", message: "Recently moved to Dhaka for work at a bank in Gulshan.", moveInDate: "2026-11-05", createdAt: "2026-10-20T20:30:00Z", updatedAt: "2026-10-20T20:30:00Z" },
  { id: "a-7", propertyId: "p-1", roomId: "r-1", tenantId: "u-t3", tenantName: "Tanvir Hasan", status: "APPROVED", message: "I would like Room A with the lake view.", moveInDate: "2026-06-01", createdAt: "2026-05-12T10:00:00Z", updatedAt: "2026-05-14T12:00:00Z" },
  { id: "a-8", propertyId: "p-11", roomId: "r-21", tenantId: "u-t7", tenantName: "Mahmudul Karim", status: "REJECTED", message: "Interested in an executive room for six months.", moveInDate: "2026-11-01", rejectReason: "The room is reserved for a 12-month tenancy.", createdAt: "2026-10-12T09:00:00Z", updatedAt: "2026-10-14T10:00:00Z" },
  { id: "a-9", propertyId: "p-3", roomId: "r-9", tenantId: "u-t2", tenantName: "Nusrat Jahan", status: "WITHDRAWN", message: "Student, budget under ৳9,000.", moveInDate: "2026-11-01", createdAt: "2026-10-03T09:00:00Z", updatedAt: "2026-10-06T14:00:00Z" },
  { id: "a-10", propertyId: "p-5", roomId: "r-12", tenantId: "u-t7", tenantName: "Mahmudul Karim", status: "APPROVED", message: "I would like to take the studio from August.", moveInDate: "2026-08-01", createdAt: "2026-07-10T09:00:00Z", updatedAt: "2026-07-12T09:00:00Z" },
];

/* ------------------------------------------------------------------ */
/* Leases — ACTIVE and TERMINATED                                      */
/* ------------------------------------------------------------------ */
const STANDARD_TERMS = [
  "Rent is due on or before the 5th of every month via bKash.",
  "A refundable security deposit of two months' rent is held for the duration of the lease.",
  "Utility bills are split equally between occupants of the unit.",
  "Either party may end the lease with 30 days' written notice.",
  "No smoking indoors. Guests are welcome but overnight stays beyond 3 nights need the owner's approval.",
];

export const leases: Lease[] = [
  { id: "l-1", propertyId: "p-2", roomId: "r-4", tenantId: "u-t1", tenantName: "Rafiq Ahmed", ownerId: "o-1", status: "ACTIVE", startDate: "2026-03-01", endDate: "2027-02-28", deposit: 25000, monthlyRent: 12500, rentDueDay: 5, terms: STANDARD_TERMS },
  { id: "l-2", propertyId: "p-2", roomId: "r-5", tenantId: "u-t2", tenantName: "Nusrat Jahan", ownerId: "o-1", status: "ACTIVE", startDate: "2026-05-01", endDate: "2027-04-30", deposit: 22000, monthlyRent: 11000, rentDueDay: 5, terms: STANDARD_TERMS },
  { id: "l-3", propertyId: "p-1", roomId: "r-1", tenantId: "u-t3", tenantName: "Tanvir Hasan", ownerId: "o-1", status: "ACTIVE", startDate: "2026-06-01", endDate: "2027-05-31", deposit: 37000, monthlyRent: 18500, rentDueDay: 5, terms: STANDARD_TERMS },
  { id: "l-4", propertyId: "p-5", roomId: "r-12", tenantId: "u-t7", tenantName: "Mahmudul Karim", ownerId: "o-1", status: "ACTIVE", startDate: "2026-08-01", endDate: "2027-07-31", deposit: 56000, monthlyRent: 28000, rentDueDay: 3, terms: STANDARD_TERMS },
  { id: "l-5", propertyId: "p-3", roomId: "r-8", tenantId: "u-t4", tenantName: "Sadia Islam", ownerId: "o-1", status: "TERMINATED", startDate: "2026-02-01", endDate: "2026-07-31", deposit: 13000, monthlyRent: 6500, rentDueDay: 5, terms: STANDARD_TERMS, terminatedAt: "2026-07-15" },
  { id: "l-6", propertyId: "p-3", roomId: "r-7", tenantId: "u-t1", tenantName: "Rafiq Ahmed", ownerId: "o-1", status: "TERMINATED", startDate: "2025-06-01", endDate: "2026-02-28", deposit: 13000, monthlyRent: 6500, rentDueDay: 5, terms: STANDARD_TERMS, terminatedAt: "2026-02-20" },
  { id: "l-7", propertyId: "p-9", roomId: "r-18", tenantId: "u-t2", tenantName: "Nusrat Jahan", ownerId: "o-1", status: "TERMINATED", startDate: "2026-01-01", endDate: "2026-03-31", deposit: 30000, monthlyRent: 15000, rentDueDay: 1, terms: STANDARD_TERMS, terminatedAt: "2026-03-31" },
  { id: "l-8", propertyId: "p-10", roomId: "r-19", tenantId: "u-t3", tenantName: "Tanvir Hasan", ownerId: "o-1", status: "TERMINATED", startDate: "2025-09-01", endDate: "2026-05-15", deposit: 26000, monthlyRent: 13000, rentDueDay: 5, terms: STANDARD_TERMS, terminatedAt: "2026-05-15" },
];

export const getLease = (id: string) => leases.find((l) => l.id === id);

/* ------------------------------------------------------------------ */
/* Payments — DEPOSIT / RENT / UTILITY × PENDING / PAID / FAILED       */
/* ------------------------------------------------------------------ */
export const payments: Payment[] = [
  // Rafiq (current tenant)
  { id: "pay-1", leaseId: "l-1", tenantId: "u-t1", tenantName: "Rafiq Ahmed", propertyId: "p-2", type: "DEPOSIT", amount: 15000, status: "PAID", bkashTrxId: "BK4T9X2M1A", bkashNumber: "01712-345601", description: "Security deposit · instalment 1 of 2", paidAt: "2026-02-27T11:20:00Z", createdAt: "2026-02-25T09:00:00Z" },
  { id: "pay-2", leaseId: "l-1", tenantId: "u-t1", tenantName: "Rafiq Ahmed", propertyId: "p-2", type: "RENT", amount: 12500, status: "PAID", bkashTrxId: "BK8Q2W6R5D", bkashNumber: "01712-345601", description: "Rent · August 2026", dueDate: "2026-08-05", paidAt: "2026-08-03T08:15:00Z", createdAt: "2026-08-01T00:00:00Z" },
  { id: "pay-3", leaseId: "l-1", tenantId: "u-t1", tenantName: "Rafiq Ahmed", propertyId: "p-2", type: "RENT", amount: 12500, status: "PAID", bkashTrxId: "BK2L7N4V9C", bkashNumber: "01712-345601", description: "Rent · September 2026", dueDate: "2026-09-05", paidAt: "2026-09-04T19:40:00Z", createdAt: "2026-09-01T00:00:00Z" },
  { id: "pay-4", leaseId: "l-1", tenantId: "u-t1", tenantName: "Rafiq Ahmed", propertyId: "p-2", type: "RENT", amount: 12500, status: "FAILED", bkashTrxId: "BK6Z1P3S8F", bkashNumber: "01712-345601", description: "Rent · October 2026", dueDate: "2026-10-05", createdAt: "2026-10-04T21:05:00Z" },
  { id: "pay-5", leaseId: "l-1", tenantId: "u-t1", tenantName: "Rafiq Ahmed", propertyId: "p-2", type: "RENT", amount: 12500, status: "PAID", bkashTrxId: "BK5M9T1K7H", bkashNumber: "01712-345601", description: "Rent · October 2026", dueDate: "2026-10-05", paidAt: "2026-10-05T07:50:00Z", createdAt: "2026-10-05T07:48:00Z" },
  { id: "pay-6", leaseId: "l-1", tenantId: "u-t1", tenantName: "Rafiq Ahmed", propertyId: "p-2", type: "RENT", amount: 12500, status: "PENDING", description: "Rent · November 2026", dueDate: "2026-11-05", createdAt: "2026-11-01T00:00:00Z" },
  { id: "pay-7", leaseId: "l-2", tenantId: "u-t2", tenantName: "Nusrat Jahan", propertyId: "p-2", type: "UTILITY", amount: 1000, status: "PENDING", description: "Service charge · October 2026", dueDate: "2026-10-31", createdAt: "2026-10-17T00:00:00Z" },
  { id: "pay-8", leaseId: "l-1", tenantId: "u-t1", tenantName: "Rafiq Ahmed", propertyId: "p-2", type: "UTILITY", amount: 600, status: "PAID", bkashTrxId: "BK3D8Y2U6B", bkashNumber: "01712-345601", description: "Internet · October 2026", dueDate: "2026-10-20", paidAt: "2026-10-17T21:30:00Z", createdAt: "2026-10-15T00:00:00Z" },
  // Others
  { id: "pay-9", leaseId: "l-2", tenantId: "u-t2", tenantName: "Nusrat Jahan", propertyId: "p-2", type: "DEPOSIT", amount: 22000, status: "PAID", bkashTrxId: "BK1R4G8J2E", bkashNumber: "01819-222310", description: "Security deposit", paidAt: "2026-04-28T10:00:00Z", createdAt: "2026-04-26T09:00:00Z" },
  { id: "pay-10", leaseId: "l-2", tenantId: "u-t2", tenantName: "Nusrat Jahan", propertyId: "p-2", type: "RENT", amount: 11000, status: "PAID", bkashTrxId: "BK9X5C3Q7A", bkashNumber: "01819-222310", description: "Rent · October 2026", dueDate: "2026-10-05", paidAt: "2026-10-03T13:00:00Z", createdAt: "2026-10-01T00:00:00Z" },
  { id: "pay-11", leaseId: "l-2", tenantId: "u-t2", tenantName: "Nusrat Jahan", propertyId: "p-2", type: "UTILITY", amount: 600, status: "PAID", bkashTrxId: "BK7B2K6N4W", bkashNumber: "01819-222310", description: "Internet · October 2026", paidAt: "2026-10-16T16:10:00Z", createdAt: "2026-10-15T00:00:00Z" },
  { id: "pay-12", leaseId: "l-3", tenantId: "u-t3", tenantName: "Tanvir Hasan", propertyId: "p-1", type: "DEPOSIT", amount: 37000, status: "PAID", bkashTrxId: "BK4H1V8Z3S", bkashNumber: "01911-908712", description: "Security deposit", paidAt: "2026-05-29T09:30:00Z", createdAt: "2026-05-27T09:00:00Z" },
  { id: "pay-13", leaseId: "l-3", tenantId: "u-t3", tenantName: "Tanvir Hasan", propertyId: "p-1", type: "RENT", amount: 18500, status: "PENDING", description: "Rent · October 2026", dueDate: "2026-10-05", createdAt: "2026-10-01T00:00:00Z" },
  { id: "pay-14", leaseId: "l-3", tenantId: "u-t3", tenantName: "Tanvir Hasan", propertyId: "p-1", type: "UTILITY", amount: 2000, status: "PAID", bkashTrxId: "BK6E3J9M5T", bkashNumber: "01911-908712", description: "Electricity · October 2026", paidAt: "2026-10-18T12:00:00Z", createdAt: "2026-10-15T00:00:00Z" },
  { id: "pay-15", leaseId: "l-4", tenantId: "u-t7", tenantName: "Mahmudul Karim", propertyId: "p-5", type: "DEPOSIT", amount: 56000, status: "PAID", bkashTrxId: "BK2S7F4P1G", bkashNumber: "01833-411209", description: "Security deposit", paidAt: "2026-07-29T14:00:00Z", createdAt: "2026-07-27T09:00:00Z" },
  { id: "pay-16", leaseId: "l-4", tenantId: "u-t7", tenantName: "Mahmudul Karim", propertyId: "p-5", type: "RENT", amount: 28000, status: "PAID", bkashTrxId: "BK8N6D2R9K", bkashNumber: "01833-411209", description: "Rent · October 2026", dueDate: "2026-10-03", paidAt: "2026-10-02T08:00:00Z", createdAt: "2026-10-01T00:00:00Z" },
  { id: "pay-17", leaseId: "l-5", tenantId: "u-t4", tenantName: "Sadia Islam", propertyId: "p-3", type: "RENT", amount: 6500, status: "FAILED", bkashTrxId: "BK5A8Q3L7Y", bkashNumber: "01611-554120", description: "Rent · July 2026", dueDate: "2026-07-05", createdAt: "2026-07-05T10:00:00Z" },
  { id: "pay-18", leaseId: "l-1", tenantId: "u-t1", tenantName: "Rafiq Ahmed", propertyId: "p-2", type: "DEPOSIT", amount: 10000, status: "PENDING", description: "Security deposit · instalment 2 of 2", dueDate: "2026-11-15", createdAt: "2026-10-20T00:00:00Z" },
];

export const paymentsForTenant = (tenantId: string) => payments.filter((p) => p.tenantId === tenantId);
