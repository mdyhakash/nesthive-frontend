import type { UtilityBill, UtilityType } from "@/types";

export const UTILITY_LABELS: Record<UtilityType, string> = {
  ELECTRICITY: "Electricity",
  GAS: "Gas",
  WATER: "Water",
  INTERNET: "Internet",
  SERVICE_CHARGE: "Service charge",
};

export const utilityBills: UtilityBill[] = [];
