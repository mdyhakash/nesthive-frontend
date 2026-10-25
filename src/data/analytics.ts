import { properties } from "./properties";
import { users } from "./users";

export const usersByRole = (["TENANT", "OWNER", "MANAGER", "ADMIN"] as const).map((role) => ({
  role: role.charAt(0) + role.slice(1).toLowerCase(),
  count: users.filter((u) => u.role === role).length * (role === "TENANT" ? 42 : role === "OWNER" ? 28 : role === "MANAGER" ? 9 : 1),
}));

export const revenueByMonth = [
  { month: "Apr", rent: 312000, deposit: 128000, utility: 38000 },
  { month: "May", rent: 358000, deposit: 164000, utility: 42000 },
  { month: "Jun", rent: 401000, deposit: 190000, utility: 47000 },
  { month: "Jul", rent: 437000, deposit: 112000, utility: 51000 },
  { month: "Aug", rent: 492000, deposit: 176000, utility: 55000 },
  { month: "Sep", rent: 531000, deposit: 143000, utility: 58000 },
  { month: "Oct", rent: 466000, deposit: 98000, utility: 49000 },
];

export const propertiesByStatus = [
  { status: "Published", count: properties.filter((p) => p.status === "PUBLISHED" && !p.isDeleted).length },
  { status: "Draft", count: properties.filter((p) => p.status === "DRAFT" && !p.isDeleted).length },
  { status: "Deleted", count: properties.filter((p) => p.isDeleted).length },
];

export const platformStats = {
  totalUsers: 1286,
  activeProperties: 312,
  monthlyRevenue: 613000,
  pendingKyc: 1,
};
