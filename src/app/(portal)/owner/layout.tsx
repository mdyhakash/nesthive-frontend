import { PortalShell } from "@/components/portal/portal-shell";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="OWNER">{children}</PortalShell>;
}
