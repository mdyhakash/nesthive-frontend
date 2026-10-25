"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Building2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PropertyForm } from "@/components/portal/property-form";
import { Button } from "@/components/ui/button";
import { useOwner } from "@/hooks/use-owner";

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const o = useOwner();
  const property = o.properties.find((p) => p.id === id);

  if (!property)
    return (
      <EmptyState
        icon={Building2}
        title="Property not found"
        description="It may have been deleted, or it belongs to another owner."
        action={
          <Button asChild>
            <Link href="/owner/properties">Back to properties</Link>
          </Button>
        }
      />
    );

  return (
    <>
      <PageHeader title="Edit property" description={property.title} />
      <PropertyForm key={property.id} property={property} />
    </>
  );
}
