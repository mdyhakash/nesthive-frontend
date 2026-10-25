"use client";

import * as React from "react";
import { useData } from "@/components/data-provider";

/** Id → record lookups over the live (in-memory) store. */
export function useLookup() {
  const { properties, rooms, users, owners, managers, leases } = useData();
  return React.useMemo(() => {
    const p = new Map(properties.map((x) => [x.id, x]));
    const r = new Map(rooms.map((x) => [x.id, x]));
    const u = new Map(users.map((x) => [x.id, x]));
    const o = new Map(owners.map((x) => [x.id, x]));
    const m = new Map(managers.map((x) => [x.id, x]));
    const l = new Map(leases.map((x) => [x.id, x]));
    return {
      property: (id?: string) => (id ? p.get(id) : undefined),
      room: (id?: string) => (id ? r.get(id) : undefined),
      user: (id?: string) => (id ? u.get(id) : undefined),
      owner: (id?: string) => (id ? o.get(id) : undefined),
      manager: (id?: string) => (id ? m.get(id) : undefined),
      lease: (id?: string) => (id ? l.get(id) : undefined),
      propertyTitle: (id?: string) => (id ? (p.get(id)?.title ?? "Unknown property") : "Unknown property"),
      roomName: (id?: string) => (id ? (r.get(id)?.name ?? "Room") : "Room"),
    };
  }, [properties, rooms, users, owners, managers, leases]);
}
