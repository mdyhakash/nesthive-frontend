import type { Room, RoomOccupant } from "@/types";

export const rooms: Room[] = [];

export const getRoom = (id: string) => rooms.find((r) => r.id === id);
export const roomsForProperty = (propertyId: string) => rooms.filter((r) => r.propertyId === propertyId);

export const occupants: RoomOccupant[] = [];

export const occupantsForRoom = (roomId: string) => occupants.filter((o) => o.roomId === roomId);
export const occupantsForProperty = (propertyId: string) => {
  const ids = new Set(rooms.filter((r) => r.propertyId === propertyId).map((r) => r.id));
  return occupants.filter((o) => ids.has(o.roomId));
};
