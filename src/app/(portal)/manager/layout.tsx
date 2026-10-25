import { PortalShell } from "@/components/portal/portal-shell";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="MANAGER">{children}</PortalShell>;
}
