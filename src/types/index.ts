/* NestHive — domain types (mirrors the backend entities; UI-only). */

export type Role = "TENANT" | "OWNER" | "ADMIN" | "MANAGER";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: UserStatus;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: string; // ISO
  lastActiveAt?: string;
}

export interface TenantProfile {
  userId: string;
  occupation: string;
  institution?: string;
  emergencyContact: { name: string; phone: string; relation: string };
  monthlyBudget: number;
  preferredAreas: string[];
  currentLeaseId?: string;
  bio?: string;
}

export type KycStatus = "PENDING" | "APPROVED" | "REJECTED";
export type KycDocumentType = "NID_FRONT" | "NID_BACK" | "OWNERSHIP_PROOF";

export interface KycDocument {
  id: string;
  type: KycDocumentType;
  fileName: string;
  url: string;
  uploadedAt: string;
}

export interface Owner {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  kycStatus: KycStatus;
  kycSubmittedAt?: string;
  kycReviewedAt?: string;
  kycRejectReason?: string;
  documents: KycDocument[];
  propertyCount: number;
}

export type ManagerStatus = "ACTIVE" | "INACTIVE";

export interface Manager {
  id: string;
  userId: string;
  ownerId: string;
  name: string;
  email: string;
  phone: string;
  status: ManagerStatus;
  assignedPropertyIds: string[];
  joinedAt: string;
}

export type PropertyStatus = "DRAFT" | "PUBLISHED";
export type PropertyType = "Apartment" | "Family flat" | "Mess" | "Sublet" | "Studio";

export interface Property {
  id: string;
  ownerId: string;
  managerId?: string;
  title: string;
  description: string;
  type: PropertyType;
  city: string;
  area: string;
  address: string;
  rent: number; // starting / total monthly rent in BDT
  status: PropertyStatus;
  isAvailable: boolean;
  isDeleted: boolean; // soft-delete flag
  images: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  createdAt: string;
}

export type RoomType = "Single" | "Shared" | "Master bedroom" | "Seat";

export interface Room {
  id: string;
  propertyId: string;
  name: string;
  type: RoomType;
  price: number;
  isAvailable: boolean;
  isPublished: boolean;
  capacity: number;
  occupantCount: number;
  amenities: string[];
  images: string[];
  sizeSqft: number;
  genderPreference: "ANY" | "MALE" | "FEMALE";
}

export interface RoomOccupant {
  id: string;
  roomId: string;
  userId: string;
  name: string;
  occupation: string;
  since: string;
  avatarUrl?: string;
}

export type SleepSchedule = "EARLY_BIRD" | "NIGHT_OWL" | "FLEXIBLE";
export type SmokingPref = "NO" | "OUTSIDE" | "YES";
export type PetsPref = "NO_PETS" | "FINE_WITH_PETS" | "HAS_PETS";
export type GuestsPref = "NEVER" | "RARELY" | "SOMETIMES" | "OFTEN";
export type NoisePref = "QUIET" | "MODERATE" | "LIVELY";
export type GenderPref = "ANY" | "MALE" | "FEMALE";

export interface RoommatePreference {
  userId: string;
  sleepSchedule: SleepSchedule;
  cleanliness: 1 | 2 | 3 | 4 | 5;
  smoking: SmokingPref;
  pets: PetsPref;
  guests: GuestsPref;
  noise: NoisePref;
  budgetMin: number;
  budgetMax: number;
  genderPreference: GenderPref;
  completedAt?: string;
}

export interface RoommateMatch {
  id: string;
  name: string;
  occupation: string;
  area: string;
  score: number; // 0-100 compatibility
  budget: number;
  sharedTraits: string[];
  preference: Omit<RoommatePreference, "userId" | "completedAt">;
}

export type ViewingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface ViewingRequest {
  id: string;
  propertyId: string;
  roomId?: string;
  tenantId: string;
  tenantName: string;
  date: string; // ISO date
  timeSlot: string; // "10:00 AM – 11:00 AM"
  status: ViewingStatus;
  note?: string;
  rejectReason?: string;
  createdAt: string;
}

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED" | "WITHDRAWN";

export interface Application {
  id: string;
  propertyId: string;
  roomId: string;
  tenantId: string;
  tenantName: string;
  status: ApplicationStatus;
  message: string;
  moveInDate: string;
  rejectReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeaseStatus = "ACTIVE" | "TERMINATED";

export interface Lease {
  id: string;
  propertyId: string;
  roomId: string;
  tenantId: string;
  tenantName: string;
  ownerId: string;
  status: LeaseStatus;
  startDate: string;
  endDate: string;
  deposit: number;
  monthlyRent: number;
  rentDueDay: number;
  terms: string[];
  terminatedAt?: string;
}

export type PaymentType = "DEPOSIT" | "RENT" | "UTILITY";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface Payment {
  id: string;
  leaseId: string;
  tenantId: string;
  tenantName: string;
  propertyId: string;
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
  bkashTrxId?: string;
  bkashNumber?: string;
  description: string;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
}

export type UtilityType = "ELECTRICITY" | "GAS" | "WATER" | "INTERNET" | "SERVICE_CHARGE";

export interface UtilitySplit {
  occupantId: string;
  name: string;
  amount: number;
  paid: boolean;
  paidAt?: string;
}

export interface UtilityBill {
  id: string;
  propertyId: string;
  type: UtilityType;
  month: string; // "2026-10"
  total: number;
  dueDate: string;
  splits: UtilitySplit[];
  createdAt: string;
}

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export interface TicketComment {
  id: string;
  authorName: string;
  authorRole: Role;
  body: string;
  createdAt: string;
}

export interface MaintenanceTicket {
  id: string;
  propertyId: string;
  roomId?: string;
  tenantId: string;
  tenantName: string;
  title: string;
  description: string;
  category: "Plumbing" | "Electrical" | "Appliance" | "Furniture" | "Cleaning" | "Other";
  priority: TicketPriority;
  status: TicketStatus;
  imageUrl?: string;
  comments: TicketComment[];
  createdAt: string;
  updatedAt: string;
}

export type NotificationKind =
  | "PAYMENT"
  | "VIEWING"
  | "APPLICATION"
  | "LEASE"
  | "MAINTENANCE"
  | "UTILITY"
  | "KYC"
  | "SYSTEM";

export interface Notification {
  id: string;
  userId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action:
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "APPROVE"
    | "REJECT"
    | "BLOCK"
    | "UNBLOCK"
    | "LOGIN"
    | "PAYMENT"
    | "PUBLISH";
  entity:
    | "User"
    | "Owner"
    | "Property"
    | "Room"
    | "Application"
    | "ViewingRequest"
    | "Lease"
    | "Payment"
    | "UtilityBill"
    | "MaintenanceTicket";
  entityId: string;
  summary: string;
  timestamp: string;
}

/* ---------- UI helper types ---------- */

export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

export interface PropertyFilters {
  query: string;
  city: string;
  area: string;
  maxRent: number;
  amenities: string[];
  sort: "recommended" | "rent-asc" | "rent-desc" | "newest";
  type?: string;
}
