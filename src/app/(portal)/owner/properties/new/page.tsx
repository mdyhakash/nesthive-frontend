"use client";

import { PageHeader } from "@/components/shared/page-header";
import { PropertyForm } from "@/components/portal/property-form";

export default function NewProperty() {
  return (
    <>
      <PageHeader title="Add a property" description="Four short steps. You can save a draft at the end and publish later." />
      <PropertyForm />
    </>
  );
}
