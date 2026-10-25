import type { Room, RoomOccupant } from "@/types";
import { gallery } from "./images";

export const rooms: Room[] = [
  // p-1 Banani
  { id: "r-1", propertyId: "p-1", name: "Room A · Lake view", type: "Master bedroom", price: 18500, isAvailable: false, isPublished: true, capacity: 1, occupantCount: 1, amenities: ["Attached bath", "Balcony", "AC"], images: gallery(["bed1", "living1"]), sizeSqft: 240, genderPreference: "ANY" },
  { id: "r-2", propertyId: "p-1", name: "Room B", type: "Single", price: 14500, isAvailable: true, isPublished: true, capacity: 1, occupantCount: 0, amenities: ["Study desk", "Wardrobe"], images: gallery(["bed2", "apt2"]), sizeSqft: 160, genderPreference: "ANY" },
  { id: "r-3", propertyId: "p-1", name: "Room C · Twin share", type: "Shared", price: 9500, isAvailable: false, isPublished: true, capacity: 2, occupantCount: 2, amenities: ["Two beds", "Shared wardrobe"], images: gallery(["bed3"]), sizeSqft: 210, genderPreference: "FEMALE" },
  // p-2 Dhanmondi
  { id: "r-4", propertyId: "p-2", name: "Room 1 · Sunroom", type: "Single", price: 12500, isAvailable: false, isPublished: true, capacity: 1, occupantCount: 1, amenities: ["Bay window", "Study desk"], images: gallery(["bed2", "living2"]), sizeSqft: 170, genderPreference: "ANY" },
  { id: "r-5", propertyId: "p-2", name: "Room 2 · Twin share", type: "Shared", price: 11000, isAvailable: true, isPublished: true, capacity: 2, occupantCount: 1, amenities: ["Two beds", "Balcony"], images: gallery(["bed1", "apt1"]), sizeSqft: 220, genderPreference: "ANY" },
  { id: "r-6", propertyId: "p-2", name: "Room 3", type: "Single", price: 13500, isAvailable: true, isPublished: true, capacity: 1, occupantCount: 0, amenities: ["Attached bath", "Wardrobe"], images: gallery(["bed4", "kitchen2"]), sizeSqft: 180, genderPreference: "ANY" },
  // p-3 Mirpur mess
  { id: "r-7", propertyId: "p-3", name: "Seat 1-A", type: "Seat", price: 6500, isAvailable: true, isPublished: true, capacity: 4, occupantCount: 3, amenities: ["Bunk bed", "Locker"], images: gallery(["bed3"]), sizeSqft: 190, genderPreference: "MALE" },
  { id: "r-8", propertyId: "p-3", name: "Seat 2-B", type: "Seat", price: 6500, isAvailable: false, isPublished: true, capacity: 4, occupantCount: 4, amenities: ["Bunk bed", "Locker"], images: gallery(["apt3"]), sizeSqft: 190, genderPreference: "MALE" },
  { id: "r-9", propertyId: "p-3", name: "Single room", type: "Single", price: 9000, isAvailable: true, isPublished: true, capacity: 1, occupantCount: 0, amenities: ["Study desk", "Ceiling fan"], images: gallery(["bed3", "kitchen1"]), sizeSqft: 120, genderPreference: "ANY" },
  // p-4 Uttara (draft)
  { id: "r-10", propertyId: "p-4", name: "Master bedroom", type: "Master bedroom", price: 14000, isAvailable: false, isPublished: false, capacity: 1, occupantCount: 0, amenities: ["Attached bath", "Balcony"], images: gallery(["apt4"]), sizeSqft: 230, genderPreference: "ANY" },
  { id: "r-11", propertyId: "p-4", name: "Room 2", type: "Single", price: 11000, isAvailable: false, isPublished: false, capacity: 1, occupantCount: 0, amenities: ["Wardrobe"], images: gallery(["living3"]), sizeSqft: 150, genderPreference: "ANY" },
  // p-5 Gulshan studio
  { id: "r-12", propertyId: "p-5", name: "Studio loft", type: "Single", price: 28000, isAvailable: false, isPublished: true, capacity: 1, occupantCount: 1, amenities: ["Furnished", "AC", "Kitchenette"], images: gallery(["loft", "interior"]), sizeSqft: 620, genderPreference: "ANY" },
  // p-6, p-7 (drafts, owner o-2)
  { id: "r-13", propertyId: "p-6", name: "Room A", type: "Single", price: 9500, isAvailable: false, isPublished: false, capacity: 1, occupantCount: 0, amenities: ["Wardrobe"], images: gallery(["bed4"]), sizeSqft: 140, genderPreference: "ANY" },
  { id: "r-14", propertyId: "p-6", name: "Room B", type: "Single", price: 10500, isAvailable: false, isPublished: false, capacity: 1, occupantCount: 0, amenities: ["Attached bath"], images: gallery(["living4"]), sizeSqft: 160, genderPreference: "ANY" },
  { id: "r-15", propertyId: "p-7", name: "Seat A", type: "Seat", price: 7000, isAvailable: false, isPublished: false, capacity: 3, occupantCount: 0, amenities: ["Bunk bed"], images: gallery(["apt2"]), sizeSqft: 180, genderPreference: "FEMALE" },
  // p-8 Mohammadpur
  { id: "r-16", propertyId: "p-8", name: "Room 1", type: "Single", price: 7500, isAvailable: true, isPublished: true, capacity: 1, occupantCount: 0, amenities: ["Study desk", "Ceiling fan"], images: gallery(["bed3", "apt1"]), sizeSqft: 130, genderPreference: "ANY" },
  { id: "r-17", propertyId: "p-8", name: "Room 2 · Twin share", type: "Shared", price: 8500, isAvailable: true, isPublished: true, capacity: 2, occupantCount: 1, amenities: ["Two beds", "Balcony"], images: gallery(["bed1"]), sizeSqft: 200, genderPreference: "ANY" },
  // p-9 Dhanmondi sublet
  { id: "r-18", propertyId: "p-9", name: "Sublet room", type: "Single", price: 15000, isAvailable: true, isPublished: true, capacity: 1, occupantCount: 0, amenities: ["Furnished", "AC", "Wi-Fi"], images: gallery(["bed1", "living5"]), sizeSqft: 160, genderPreference: "ANY" },
  // p-10 Mirpur DOHS
  { id: "r-19", propertyId: "p-10", name: "Room 1 · Sunrise", type: "Shared", price: 13000, isAvailable: true, isPublished: true, capacity: 2, occupantCount: 1, amenities: ["East-facing", "Balcony"], images: gallery(["bed4", "modern"]), sizeSqft: 230, genderPreference: "ANY" },
  { id: "r-20", propertyId: "p-10", name: "Room 2", type: "Single", price: 14500, isAvailable: true, isPublished: true, capacity: 1, occupantCount: 0, amenities: ["Attached bath", "Study desk"], images: gallery(["bed5", "kitchen2"]), sizeSqft: 175, genderPreference: "ANY" },
  // p-11 Banani exec
  { id: "r-21", propertyId: "p-11", name: "Executive room 1", type: "Master bedroom", price: 20000, isAvailable: true, isPublished: true, capacity: 1, occupantCount: 0, amenities: ["Furnished", "AC", "Attached bath"], images: gallery(["interior", "bed5"]), sizeSqft: 210, genderPreference: "ANY" },
  { id: "r-22", propertyId: "p-11", name: "Executive room 2", type: "Master bedroom", price: 22000, isAvailable: false, isPublished: true, capacity: 1, occupantCount: 1, amenities: ["Furnished", "AC", "Balcony"], images: gallery(["bed5", "apt3"]), sizeSqft: 230, genderPreference: "ANY" },
  // p-12 deleted
  { id: "r-23", propertyId: "p-12", name: "Room A", type: "Single", price: 8500, isAvailable: false, isPublished: true, capacity: 1, occupantCount: 0, amenities: ["Wardrobe"], images: gallery(["apt4"]), sizeSqft: 140, genderPreference: "ANY" },
];

export const getRoom = (id: string) => rooms.find((r) => r.id === id);
export const roomsForProperty = (propertyId: string) => rooms.filter((r) => r.propertyId === propertyId);

export const occupants: RoomOccupant[] = [
  { id: "ro-1", roomId: "r-1", userId: "u-t3", name: "Tanvir Hasan", occupation: "Marketing executive", since: "2026-06-01" },
  { id: "ro-2", roomId: "r-3", userId: "ext-1", name: "Mitu Rahman", occupation: "Banker", since: "2026-03-15" },
  { id: "ro-3", roomId: "r-3", userId: "ext-2", name: "Lamia Chowdhury", occupation: "Architect", since: "2026-05-10" },
  { id: "ro-4", roomId: "r-4", userId: "u-t1", name: "Rafiq Ahmed", occupation: "Software engineer", since: "2026-03-01" },
  { id: "ro-5", roomId: "r-5", userId: "u-t2", name: "Nusrat Jahan", occupation: "Graduate student", since: "2026-05-01" },
  { id: "ro-6", roomId: "r-7", userId: "ext-3", name: "Sabbir Ahmed", occupation: "Student", since: "2026-01-20" },
  { id: "ro-7", roomId: "r-7", userId: "ext-4", name: "Jubayer Alam", occupation: "Student", since: "2026-02-04" },
  { id: "ro-8", roomId: "r-7", userId: "ext-5", name: "Rakibul Islam", occupation: "Junior accountant", since: "2026-04-12" },
  { id: "ro-9", roomId: "r-8", userId: "ext-6", name: "Abir Khan", occupation: "Student", since: "2026-02-01" },
  { id: "ro-10", roomId: "r-8", userId: "ext-7", name: "Nayeem Sarker", occupation: "Student", since: "2026-02-01" },
  { id: "ro-11", roomId: "r-8", userId: "ext-8", name: "Shihab Mahmud", occupation: "Student", since: "2026-03-22" },
  { id: "ro-12", roomId: "r-8", userId: "ext-9", name: "Fahim Reza", occupation: "Student", since: "2026-03-22" },
  { id: "ro-13", roomId: "r-12", userId: "u-t7", name: "Mahmudul Karim", occupation: "Product manager", since: "2026-08-01" },
  { id: "ro-14", roomId: "r-17", userId: "ext-10", name: "Tania Sultana", occupation: "Teacher", since: "2026-07-01" },
  { id: "ro-15", roomId: "r-19", userId: "ext-11", name: "Arman Hossain", occupation: "Data analyst", since: "2026-09-15" },
  { id: "ro-16", roomId: "r-22", userId: "ext-12", name: "Zahid Hasan", occupation: "Consultant", since: "2026-09-01" },
];

export const occupantsForRoom = (roomId: string) => occupants.filter((o) => o.roomId === roomId);
export const occupantsForProperty = (propertyId: string) => {
  const ids = new Set(rooms.filter((r) => r.propertyId === propertyId).map((r) => r.id));
  return occupants.filter((o) => ids.has(o.roomId));
};
