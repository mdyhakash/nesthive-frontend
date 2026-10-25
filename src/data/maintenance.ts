import type { MaintenanceTicket } from "@/types";

export const maintenanceTickets: MaintenanceTicket[] = [
  {
    id: "t-1", propertyId: "p-2", roomId: "r-4", tenantId: "u-t1", tenantName: "Rafiq Ahmed",
    title: "Bathroom tap is leaking", description: "The cold-water tap in the attached bathroom drips all day and has started leaving a stain on the sink.",
    category: "Plumbing", priority: "MEDIUM", status: "IN_PROGRESS",
    imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=60",
    comments: [
      { id: "c-1", authorName: "Habibur Rahman", authorRole: "MANAGER", body: "A plumber is booked for Friday morning. Please keep the bathroom accessible.", createdAt: "2026-10-20T10:00:00Z" },
      { id: "c-2", authorName: "Rafiq Ahmed", authorRole: "TENANT", body: "Thanks. I'll be working from home on Friday.", createdAt: "2026-10-20T10:30:00Z" },
    ],
    createdAt: "2026-10-18T08:00:00Z", updatedAt: "2026-10-20T10:00:00Z",
  },
  {
    id: "t-2", propertyId: "p-2", roomId: "r-4", tenantId: "u-t1", tenantName: "Rafiq Ahmed",
    title: "Ceiling fan wobbles at high speed", description: "The fan in my room shakes at speed 4 and 5 and makes a clicking noise.",
    category: "Electrical", priority: "LOW", status: "OPEN", comments: [],
    createdAt: "2026-10-21T14:00:00Z", updatedAt: "2026-10-21T14:00:00Z",
  },
  {
    id: "t-3", propertyId: "p-2", roomId: "r-4", tenantId: "u-t1", tenantName: "Rafiq Ahmed",
    title: "Window latch broken", description: "The latch on the bay window no longer locks.",
    category: "Other", priority: "HIGH", status: "RESOLVED",
    comments: [{ id: "c-3", authorName: "Habibur Rahman", authorRole: "MANAGER", body: "Latch replaced and tested. Closing this ticket.", createdAt: "2026-09-14T15:00:00Z" }],
    createdAt: "2026-09-11T09:00:00Z", updatedAt: "2026-09-14T15:00:00Z",
  },
  {
    id: "t-4", propertyId: "p-1", roomId: "r-1", tenantId: "u-t3", tenantName: "Tanvir Hasan",
    title: "Geyser not heating", description: "No hot water in the master bathroom since yesterday evening.",
    category: "Appliance", priority: "URGENT", status: "OPEN", comments: [],
    createdAt: "2026-10-21T20:00:00Z", updatedAt: "2026-10-21T20:00:00Z",
  },
  {
    id: "t-5", propertyId: "p-1", tenantId: "u-t3", tenantName: "Tanvir Hasan",
    title: "Kitchen sink drains slowly", description: "Water pools in the kitchen sink for several minutes.",
    category: "Plumbing", priority: "MEDIUM", status: "IN_PROGRESS",
    comments: [{ id: "c-4", authorName: "Habibur Rahman", authorRole: "MANAGER", body: "Cleaning crew scheduled for Sunday.", createdAt: "2026-10-19T11:00:00Z" }],
    createdAt: "2026-10-17T12:00:00Z", updatedAt: "2026-10-19T11:00:00Z",
  },
  {
    id: "t-6", propertyId: "p-2", roomId: "r-5", tenantId: "u-t2", tenantName: "Nusrat Jahan",
    title: "Wi-Fi router keeps restarting", description: "The router in the living room restarts every few hours.",
    category: "Appliance", priority: "HIGH", status: "RESOLVED",
    comments: [{ id: "c-5", authorName: "Habibur Rahman", authorRole: "MANAGER", body: "Router replaced by the ISP.", createdAt: "2026-10-12T17:00:00Z" }],
    createdAt: "2026-10-09T09:30:00Z", updatedAt: "2026-10-12T17:00:00Z",
  },
  {
    id: "t-7", propertyId: "p-5", roomId: "r-12", tenantId: "u-t7", tenantName: "Mahmudul Karim",
    title: "AC remote not working", description: "The remote for the main AC unit doesn't respond even after changing batteries.",
    category: "Appliance", priority: "LOW", status: "OPEN", comments: [],
    createdAt: "2026-10-20T18:00:00Z", updatedAt: "2026-10-20T18:00:00Z",
  },
  {
    id: "t-8", propertyId: "p-3", roomId: "r-8", tenantId: "u-t4", tenantName: "Sadia Islam",
    title: "Stairwell light out", description: "The light on the second-floor landing has been out for a week.",
    category: "Electrical", priority: "MEDIUM", status: "RESOLVED", comments: [],
    createdAt: "2026-07-01T09:00:00Z", updatedAt: "2026-07-03T09:00:00Z",
  },
  {
    id: "t-9", propertyId: "p-3", tenantId: "u-t4", tenantName: "Sadia Islam",
    title: "Gas leak smell near the stove", description: "There is a strong gas smell near the stove after cooking.",
    category: "Plumbing", priority: "URGENT", status: "IN_PROGRESS",
    comments: [{ id: "c-6", authorName: "Moushumi Khan", authorRole: "MANAGER", body: "Gas line shut off. Technician arriving today.", createdAt: "2026-10-21T08:30:00Z" }],
    createdAt: "2026-10-21T07:50:00Z", updatedAt: "2026-10-21T08:30:00Z",
  },
  {
    id: "t-10", propertyId: "p-11", roomId: "r-22", tenantId: "u-t7", tenantName: "Mahmudul Karim",
    title: "Please repaint scuffed wall", description: "The wall behind the bed has several scuff marks from the previous tenant.",
    category: "Cleaning", priority: "LOW", status: "OPEN", comments: [],
    createdAt: "2026-10-14T10:00:00Z", updatedAt: "2026-10-14T10:00:00Z",
  },
];

export const getTicket = (id: string) => maintenanceTickets.find((t) => t.id === id);
