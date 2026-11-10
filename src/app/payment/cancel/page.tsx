import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentCancelContent } from "./cancel-content";

export const metadata: Metadata = {
  title: "Payment Cancelled | NestHive",
  description: "The payment process was cancelled or was not completed.",
};

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-[80dvh] max-w-2xl flex-col items-center justify-center px-4 py-12">
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
        <PaymentCancelContent />
      </Suspense>
    </div>
  );
}

