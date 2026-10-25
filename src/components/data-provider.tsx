"use client";

import * as React from "react";
import { applications as seedApplications, leases as seedLeases, payments as seedPayments, viewingRequests as seedViewings } from "@/data/activity";
import { auditLogs as seedAudit } from "@/data/audit";
import { maintenanceTickets as seedTickets } from "@/data/maintenance";
import { notifications as seedNotifications } from "@/data/notifications";
import { properties as seedProperties } from "@/data/properties";
import { rooms as seedRooms } from "@/data/rooms";
import { managers as seedManagers, owners as seedOwners, users as seedUsers } from "@/data/users";
import { utilityBills as seedBills } from "@/data/utilities";
import { MOCK_NOW } from "@/lib/format";
import type {
  Application,
  AuditLog,
  Lease,
  MaintenanceTicket,
  Manager,
  Notification,
  Owner,
  Payment,
  Property,
  Room,
  User,
  UtilityBill,
  ViewingRequest,
} from "@/types";

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

interface DataContextValue {
  viewings: ViewingRequest[];
  setViewings: Setter<ViewingRequest[]>;
  applications: Application[];
  setApplications: Setter<Application[]>;
  leases: Lease[];
  setLeases: Setter<Lease[]>;
  payments: Payment[];
  setPayments: Setter<Payment[]>;
  bills: UtilityBill[];
  setBills: Setter<UtilityBill[]>;
  tickets: MaintenanceTicket[];
  setTickets: Setter<MaintenanceTicket[]>;
  notifications: Notification[];
  setNotifications: Setter<Notification[]>;
  properties: Property[];
  setProperties: Setter<Property[]>;
  rooms: Room[];
  setRooms: Setter<Room[]>;
  owners: Owner[];
  setOwners: Setter<Owner[]>;
  managers: Manager[];
  setManagers: Setter<Manager[]>;
  users: User[];
  setUsers: Setter<User[]>;
  auditLogs: AuditLog[];
  /** Append an audit-log entry (newest first). */
  audit: (entry: Omit<AuditLog, "id" | "timestamp">) => void;
  /** Add a notification for a user. */
  notify: (n: Pick<Notification, "userId" | "kind" | "title" | "body"> & { href?: string }) => void;
}

const DataContext = React.createContext<DataContextValue | null>(null);

/**
 * In-memory "database" seeded from src/data. State lives only in React, so a
 * page reload resets everything. This keeps the demo coherent across pages and
 * roles without any persistence or network.
 */
export function DataProvider({ children }: { children: React.ReactNode }) {
  const [viewings, setViewings] = React.useState(seedViewings);
  const [applications, setApplications] = React.useState(seedApplications);
  const [leases, setLeases] = React.useState(seedLeases);
  const [payments, setPayments] = React.useState(seedPayments);
  const [bills, setBills] = React.useState(seedBills);
  const [tickets, setTickets] = React.useState(seedTickets);
  const [notifications, setNotifications] = React.useState(seedNotifications);
  const [properties, setProperties] = React.useState(seedProperties);
  const [rooms, setRooms] = React.useState(seedRooms);
  const [owners, setOwners] = React.useState(seedOwners);
  const [managers, setManagers] = React.useState(seedManagers);
  const [users, setUsers] = React.useState(seedUsers);
  const [auditLogs, setAuditLogs] = React.useState(seedAudit);
  const counter = React.useRef(0);

  const audit = React.useCallback<DataContextValue["audit"]>((entry) => {
    counter.current += 1;
    setAuditLogs((prev) => [
      { ...entry, id: `al-new-${counter.current}`, timestamp: MOCK_NOW.toISOString() },
      ...prev,
    ]);
  }, []);

  const notify = React.useCallback<DataContextValue["notify"]>((n) => {
    counter.current += 1;
    setNotifications((prev) => [
      { ...n, id: `n-new-${counter.current}`, read: false, createdAt: MOCK_NOW.toISOString() },
      ...prev,
    ]);
  }, []);

  const value = React.useMemo<DataContextValue>(
    () => ({
      viewings, setViewings,
      applications, setApplications,
      leases, setLeases,
      payments, setPayments,
      bills, setBills,
      tickets, setTickets,
      notifications, setNotifications,
      properties, setProperties,
      rooms, setRooms,
      owners, setOwners,
      managers, setManagers,
      users, setUsers,
      auditLogs, audit, notify,
    }),
    [viewings, applications, leases, payments, bills, tickets, notifications, properties, rooms, owners, managers, users, auditLogs, audit, notify],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = React.useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within <DataProvider>");
  return ctx;
}

/** Convenience: monotonically unique ids for locally-created records. */
let seq = 0;
export function newId(prefix: string) {
  seq += 1;
  return `${prefix}-new-${seq}`;
}
