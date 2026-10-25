import { PortalShell } from "@/components/portal/portal-shell";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="TENANT">{children}</PortalShell>;
}
