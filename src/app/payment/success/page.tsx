import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, FileText, ArrowRight, Printer, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentSuccessContent } from "./success-content";

export const metadata: Metadata = {
  title: "Payment Successful | NestHive",
  description: "Your payment has been successfully processed.",
};

export default function PaymentSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[80dvh] max-w-2xl flex-col items-center justify-center px-4 py-12">
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}

