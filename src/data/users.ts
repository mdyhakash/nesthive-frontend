import type { Manager, Owner, TenantProfile, User } from "@/types";

/** 14 users covering every role and both statuses. */
export const users: User[] = [
  // Tenants
  { id: "u-t1", name: "Rafiq Ahmed", email: "rafiq.ahmed@example.com", phone: "01712-345601", role: "TENANT", status: "ACTIVE", emailVerified: true, createdAt: "2026-03-12T09:00:00Z", lastActiveAt: "2026-10-21T14:10:00Z" },
  { id: "u-t2", name: "Nusrat Jahan", email: "nusrat.jahan@example.com", phone: "01819-222310", role: "TENANT", status: "ACTIVE", emailVerified: true, createdAt: "2026-04-02T08:30:00Z", lastActiveAt: "2026-10-20T19:45:00Z" },
  { id: "u-t3", name: "Tanvir Hasan", email: "tanvir.hasan@example.com", phone: "01911-908712", role: "TENANT", status: "ACTIVE", emailVerified: true, createdAt: "2026-05-19T11:15:00Z", lastActiveAt: "2026-10-19T07:20:00Z" },
  { id: "u-t4", name: "Sadia Islam", email: "sadia.islam@example.com", phone: "01611-554120", role: "TENANT", status: "BLOCKED", emailVerified: true, createdAt: "2026-02-08T16:00:00Z", lastActiveAt: "2026-09-02T10:00:00Z" },
  { id: "u-t5", name: "Imran Hossain", email: "imran.hossain@example.com", phone: "01515-667420", role: "TENANT", status: "ACTIVE", emailVerified: false, createdAt: "2026-10-18T13:40:00Z", lastActiveAt: "2026-10-18T13:45:00Z" },
  { id: "u-t6", name: "Farhana Akter", email: "farhana.akter@example.com", phone: "01721-338811", role: "TENANT", status: "ACTIVE", emailVerified: true, createdAt: "2026-06-01T10:05:00Z", lastActiveAt: "2026-10-21T09:30:00Z" },
  { id: "u-t7", name: "Mahmudul Karim", email: "mahmudul.karim@example.com", phone: "01833-411209", role: "TENANT", status: "ACTIVE", emailVerified: true, createdAt: "2026-07-14T12:25:00Z", lastActiveAt: "2026-10-15T18:00:00Z" },
  // Owners
  { id: "u-o1", name: "Kamal Uddin", email: "kamal.uddin@example.com", phone: "01711-880021", role: "OWNER", status: "ACTIVE", emailVerified: true, createdAt: "2026-01-20T08:00:00Z", lastActiveAt: "2026-10-21T16:00:00Z" },
  { id: "u-o2", name: "Shirin Akter", email: "shirin.akter@example.com", phone: "01922-100455", role: "OWNER", status: "ACTIVE", emailVerified: true, createdAt: "2026-08-25T09:40:00Z", lastActiveAt: "2026-10-21T11:15:00Z" },
  { id: "u-o3", name: "Anwar Hossain", email: "anwar.hossain@example.com", phone: "01814-702231", role: "OWNER", status: "ACTIVE", emailVerified: true, createdAt: "2026-09-30T15:20:00Z", lastActiveAt: "2026-10-17T12:00:00Z" },
  { id: "u-o4", name: "Rezaul Karim", email: "rezaul.karim@example.com", phone: "01618-445900", role: "OWNER", status: "BLOCKED", emailVerified: true, createdAt: "2026-05-05T10:10:00Z", lastActiveAt: "2026-08-12T10:00:00Z" },
  // Managers
  { id: "u-m1", name: "Habibur Rahman", email: "habibur.rahman@example.com", phone: "01755-209988", role: "MANAGER", status: "ACTIVE", emailVerified: true, createdAt: "2026-02-14T09:00:00Z", lastActiveAt: "2026-10-21T15:30:00Z" },
  { id: "u-m2", name: "Moushumi Khan", email: "moushumi.khan@example.com", phone: "01844-770013", role: "MANAGER", status: "ACTIVE", emailVerified: true, createdAt: "2026-06-22T11:00:00Z", lastActiveAt: "2026-10-20T10:45:00Z" },
  // Admin
  { id: "u-a1", name: "Tahmina Akter", email: "admin@nesthive.com.bd", phone: "01700-000001", role: "ADMIN", status: "ACTIVE", emailVerified: true, createdAt: "2025-12-01T08:00:00Z", lastActiveAt: "2026-10-21T17:00:00Z" },
];

export const getUser = (id: string) => users.find((u) => u.id === id);

/** Demo accounts used by the mock login + role switcher. */
export const demoAccounts = {
  TENANT: users.find((u) => u.id === "u-t1")!,
  OWNER: users.find((u) => u.id === "u-o1")!,
  MANAGER: users.find((u) => u.id === "u-m1")!,
  ADMIN: users.find((u) => u.id === "u-a1")!,
} as const;

export const tenantProfiles: TenantProfile[] = [
  {
    userId: "u-t1",
    occupation: "Software engineer",
    institution: "Pathao",
    emergencyContact: { name: "Rahela Ahmed", phone: "01711-000451", relation: "Mother" },
    monthlyBudget: 15000,
    preferredAreas: ["Mirpur", "Dhanmondi", "Mohammadpur"],
    currentLeaseId: "l-1",
    bio: "Early riser, works hybrid. Prefers a calm flat with good natural light.",
  },
  {
    userId: "u-t2",
    occupation: "Graduate student",
    institution: "University of Dhaka",
    emergencyContact: { name: "Jahangir Alam", phone: "01819-000112", relation: "Father" },
    monthlyBudget: 9000,
    preferredAreas: ["Dhanmondi", "Mohammadpur"],
    currentLeaseId: "l-2",
  },
  {
    userId: "u-t3",
    occupation: "Marketing executive",
    institution: "Grameenphone",
    emergencyContact: { name: "Shamim Hasan", phone: "01911-000338", relation: "Brother" },
    monthlyBudget: 18000,
    preferredAreas: ["Banani", "Gulshan"],
    currentLeaseId: "l-3",
  },
  {
    userId: "u-t6",
    occupation: "UI designer",
    institution: "Freelance",
    emergencyContact: { name: "Rubina Akter", phone: "01721-000775", relation: "Sister" },
    monthlyBudget: 12000,
    preferredAreas: ["Uttara", "Bashundhara"],
  },
];

export const owners: Owner[] = [
  {
    id: "o-1",
    userId: "u-o1",
    name: "Kamal Uddin",
    email: "kamal.uddin@example.com",
    phone: "01711-880021",
    businessName: "Uddin Properties",
    kycStatus: "APPROVED",
    kycSubmittedAt: "2026-01-22T10:00:00Z",
    kycReviewedAt: "2026-01-25T12:30:00Z",
    documents: [
      { id: "d-1", type: "NID_FRONT", fileName: "nid-front.jpg", url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=60", uploadedAt: "2026-01-22T10:00:00Z" },
      { id: "d-2", type: "NID_BACK", fileName: "nid-back.jpg", url: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=60", uploadedAt: "2026-01-22T10:01:00Z" },
      { id: "d-3", type: "OWNERSHIP_PROOF", fileName: "dolil-banani.pdf", url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=60", uploadedAt: "2026-01-22T10:03:00Z" },
    ],
    propertyCount: 9,
  },
  {
    id: "o-2",
    userId: "u-o2",
    name: "Shirin Akter",
    email: "shirin.akter@example.com",
    phone: "01922-100455",
    businessName: "Shirin Homes",
    kycStatus: "PENDING",
    kycSubmittedAt: "2026-10-19T09:15:00Z",
    documents: [
      { id: "d-4", type: "NID_FRONT", fileName: "nid-front.jpg", url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=60", uploadedAt: "2026-10-19T09:15:00Z" },
      { id: "d-5", type: "NID_BACK", fileName: "nid-back.jpg", url: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=60", uploadedAt: "2026-10-19T09:16:00Z" },
      { id: "d-6", type: "OWNERSHIP_PROOF", fileName: "ownership-uttara.pdf", url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=60", uploadedAt: "2026-10-19T09:18:00Z" },
    ],
    propertyCount: 2,
  },
  {
    id: "o-3",
    userId: "u-o3",
    name: "Anwar Hossain",
    email: "anwar.hossain@example.com",
    phone: "01814-702231",
    kycStatus: "REJECTED",
    kycSubmittedAt: "2026-10-05T14:00:00Z",
    kycReviewedAt: "2026-10-08T11:00:00Z",
    kycRejectReason: "The NID back photo is blurry and the ownership document name doesn't match your NID. Please upload clear scans.",
    documents: [
      { id: "d-7", type: "NID_FRONT", fileName: "nid-front.jpg", url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=60", uploadedAt: "2026-10-05T14:00:00Z" },
      { id: "d-8", type: "NID_BACK", fileName: "nid-back-blur.jpg", url: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=60", uploadedAt: "2026-10-05T14:01:00Z" },
    ],
    propertyCount: 0,
  },
  {
    id: "o-4",
    userId: "u-o4",
    name: "Rezaul Karim",
    email: "rezaul.karim@example.com",
    phone: "01618-445900",
    businessName: "RK Rentals",
    kycStatus: "APPROVED",
    kycSubmittedAt: "2026-05-06T10:00:00Z",
    kycReviewedAt: "2026-05-08T10:00:00Z",
    documents: [
      { id: "d-9", type: "NID_FRONT", fileName: "nid-front.jpg", url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=60", uploadedAt: "2026-05-06T10:00:00Z" },
      { id: "d-10", type: "NID_BACK", fileName: "nid-back.jpg", url: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=60", uploadedAt: "2026-05-06T10:01:00Z" },
      { id: "d-11", type: "OWNERSHIP_PROOF", fileName: "ownership.pdf", url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=60", uploadedAt: "2026-05-06T10:02:00Z" },
    ],
    propertyCount: 1,
  },
];

export const managers: Manager[] = [
  { id: "m-1", userId: "u-m1", ownerId: "o-1", name: "Habibur Rahman", email: "habibur.rahman@example.com", phone: "01755-209988", status: "ACTIVE", assignedPropertyIds: ["p-1", "p-2", "p-5"], joinedAt: "2026-02-14T09:00:00Z" },
  { id: "m-2", userId: "u-m2", ownerId: "o-1", name: "Moushumi Khan", email: "moushumi.khan@example.com", phone: "01844-770013", status: "ACTIVE", assignedPropertyIds: ["p-3"], joinedAt: "2026-06-22T11:00:00Z" },
  { id: "m-3", userId: "u-m3", ownerId: "o-1", name: "Shahidul Islam", email: "shahidul.islam@example.com", phone: "01933-612004", status: "INACTIVE", assignedPropertyIds: [], joinedAt: "2026-03-30T09:00:00Z" },
];

/** The signed-in demo identities. */
export const CURRENT_TENANT_ID = "u-t1";
export const CURRENT_OWNER_ID = "o-1";
export const CURRENT_MANAGER_ID = "m-1";
