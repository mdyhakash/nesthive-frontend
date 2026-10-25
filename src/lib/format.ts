/**
 * Deterministic formatters. They avoid locale / timezone lookups at render time
 * so server and client output are identical (no hydration mismatches).
 */

/** "Now" for all mock relative-time math: Thu 22 Oct 2026, just after midnight in Dhaka. */
export const MOCK_NOW = new Date("2026-10-21T18:30:00Z");

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Lakh/crore-style digit grouping used in Bangladesh: 1,80,000. */
export function groupDigits(n: number): string {
  const sign = n < 0 ? "-" : "";
  const s = Math.abs(Math.round(n)).toString();
  if (s.length <= 3) return sign + s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}${rest},${last3}`;
}

/** ৳18,000 */
export function formatBDT(amount: number): string {
  return `৳${groupDigits(amount)}`;
}

/** Compact: ৳1.2L, ৳4.5K */
export function formatBDTCompact(amount: number): string {
  if (amount >= 10_000_000) return `৳${(amount / 10_000_000).toFixed(1)}Cr`;
  if (amount >= 100_000) return `৳${(amount / 100_000).toFixed(1)}L`;
  if (amount >= 1_000) return `৳${(amount / 1_000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  return `৳${amount}`;
}

function parts(iso: string) {
  const d = new Date(iso);
  // Dhaka is UTC+6, no DST.
  const local = new Date(d.getTime() + 6 * 60 * 60 * 1000);
  return {
    y: local.getUTCFullYear(),
    m: local.getUTCMonth(),
    d: local.getUTCDate(),
    h: local.getUTCHours(),
    min: local.getUTCMinutes(),
    dow: local.getUTCDay(),
  };
}

/** 22 Oct 2026 */
export function formatDate(iso: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [y, m, d] = iso.split("-").map(Number);
    return `${d} ${MONTHS[m - 1]} ${y}`;
  }
  const p = parts(iso);
  return `${p.d} ${MONTHS[p.m]} ${p.y}`;
}

/** 22 Oct, 12:17 AM */
export function formatDateTime(iso: string): string {
  const p = parts(iso);
  const hr12 = p.h % 12 === 0 ? 12 : p.h % 12;
  const ampm = p.h >= 12 ? "PM" : "AM";
  return `${p.d} ${MONTHS[p.m]}, ${hr12}:${String(p.min).padStart(2, "0")} ${ampm}`;
}

/** "2026-10" → "October 2026" */
export function formatMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS_LONG[m - 1]} ${y}`;
}

/** "2026-10" → "Oct" */
export function shortMonth(ym: string): string {
  const [, m] = ym.split("-").map(Number);
  return MONTHS[m - 1];
}

export function timeAgo(iso: string, now: Date = MOCK_NOW): string {
  const diff = now.getTime() - new Date(iso).getTime();
  const future = diff < 0;
  const abs = Math.abs(diff);
  const min = Math.round(abs / 60_000);
  const hr = Math.round(abs / 3_600_000);
  const day = Math.round(abs / 86_400_000);
  let label: string;
  if (min < 1) return "Just now";
  if (min < 60) label = `${min}m`;
  else if (hr < 24) label = `${hr}h`;
  else if (day < 30) label = `${day}d`;
  else return formatDate(iso);
  return future ? `in ${label}` : `${label} ago`;
}

/** Days from MOCK_NOW to an ISO date (negative if past). */
export function daysUntil(iso: string, now: Date = MOCK_NOW): number {
  const target = new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00+06:00` : iso);
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function pluralize(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}
