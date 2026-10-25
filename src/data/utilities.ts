import type { UtilityBill, UtilityType } from "@/types";

export const UTILITY_LABELS: Record<UtilityType, string> = {
  ELECTRICITY: "Electricity",
  GAS: "Gas",
  WATER: "Water",
  INTERNET: "Internet",
  SERVICE_CHARGE: "Service charge",
};

export const utilityBills: UtilityBill[] = [
  {
    id: "ub-1", propertyId: "p-2", type: "ELECTRICITY", month: "2026-10", total: 4400, dueDate: "2026-10-28", createdAt: "2026-10-15T09:00:00Z",
    splits: [
      { occupantId: "u-t1", name: "Rafiq Ahmed", amount: 2200, paid: false },
      { occupantId: "u-t2", name: "Nusrat Jahan", amount: 2200, paid: true, paidAt: "2026-10-18T10:00:00Z" },
    ],
  },
  {
    id: "ub-2", propertyId: "p-2", type: "INTERNET", month: "2026-10", total: 1200, dueDate: "2026-10-20", createdAt: "2026-10-15T09:05:00Z",
    splits: [
      { occupantId: "u-t1", name: "Rafiq Ahmed", amount: 600, paid: true, paidAt: "2026-10-17T21:30:00Z" },
      { occupantId: "u-t2", name: "Nusrat Jahan", amount: 600, paid: true, paidAt: "2026-10-16T16:10:00Z" },
    ],
  },
  {
    id: "ub-3", propertyId: "p-2", type: "GAS", month: "2026-10", total: 1000, dueDate: "2026-10-30", createdAt: "2026-10-16T09:00:00Z",
    splits: [
      { occupantId: "u-t1", name: "Rafiq Ahmed", amount: 500, paid: false },
      { occupantId: "u-t2", name: "Nusrat Jahan", amount: 500, paid: false },
    ],
  },
  {
    id: "ub-4", propertyId: "p-2", type: "ELECTRICITY", month: "2026-09", total: 3900, dueDate: "2026-09-28", createdAt: "2026-09-15T09:00:00Z",
    splits: [
      { occupantId: "u-t1", name: "Rafiq Ahmed", amount: 1950, paid: true, paidAt: "2026-09-20T09:00:00Z" },
      { occupantId: "u-t2", name: "Nusrat Jahan", amount: 1950, paid: true, paidAt: "2026-09-22T09:00:00Z" },
    ],
  },
  {
    id: "ub-5", propertyId: "p-2", type: "WATER", month: "2026-09", total: 600, dueDate: "2026-09-30", createdAt: "2026-09-15T09:10:00Z",
    splits: [
      { occupantId: "u-t1", name: "Rafiq Ahmed", amount: 300, paid: true, paidAt: "2026-09-24T09:00:00Z" },
      { occupantId: "u-t2", name: "Nusrat Jahan", amount: 300, paid: true, paidAt: "2026-09-25T09:00:00Z" },
    ],
  },
  {
    id: "ub-6", propertyId: "p-2", type: "SERVICE_CHARGE", month: "2026-10", total: 2000, dueDate: "2026-10-31", createdAt: "2026-10-17T09:00:00Z",
    splits: [
      { occupantId: "u-t1", name: "Rafiq Ahmed", amount: 1000, paid: true, paidAt: "2026-10-19T12:00:00Z" },
      { occupantId: "u-t2", name: "Nusrat Jahan", amount: 1000, paid: false },
    ],
  },
  {
    id: "ub-7", propertyId: "p-1", type: "ELECTRICITY", month: "2026-10", total: 6000, dueDate: "2026-10-28", createdAt: "2026-10-15T09:00:00Z",
    splits: [
      { occupantId: "u-t3", name: "Tanvir Hasan", amount: 2000, paid: true, paidAt: "2026-10-18T12:00:00Z" },
      { occupantId: "ext-1", name: "Mitu Rahman", amount: 2000, paid: true, paidAt: "2026-10-19T12:00:00Z" },
      { occupantId: "ext-2", name: "Lamia Chowdhury", amount: 2000, paid: false },
    ],
  },
  {
    id: "ub-8", propertyId: "p-3", type: "GAS", month: "2026-10", total: 4900, dueDate: "2026-10-30", createdAt: "2026-10-16T09:00:00Z",
    splits: [
      { occupantId: "ext-3", name: "Sabbir Ahmed", amount: 700, paid: true, paidAt: "2026-10-18T09:00:00Z" },
      { occupantId: "ext-4", name: "Jubayer Alam", amount: 700, paid: true, paidAt: "2026-10-18T09:30:00Z" },
      { occupantId: "ext-5", name: "Rakibul Islam", amount: 700, paid: false },
      { occupantId: "ext-6", name: "Abir Khan", amount: 700, paid: false },
      { occupantId: "ext-7", name: "Nayeem Sarker", amount: 700, paid: true, paidAt: "2026-10-19T10:00:00Z" },
      { occupantId: "ext-8", name: "Shihab Mahmud", amount: 700, paid: false },
      { occupantId: "ext-9", name: "Fahim Reza", amount: 700, paid: true, paidAt: "2026-10-20T10:00:00Z" },
    ],
  },
  {
    id: "ub-9", propertyId: "p-11", type: "INTERNET", month: "2026-10", total: 2500, dueDate: "2026-10-25", createdAt: "2026-10-15T09:00:00Z",
    splits: [{ occupantId: "ext-12", name: "Zahid Hasan", amount: 2500, paid: true, paidAt: "2026-10-16T09:00:00Z" }],
  },
];

export const billsForProperty = (propertyId: string) => utilityBills.filter((b) => b.propertyId === propertyId);
