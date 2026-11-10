"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "Payment cancelled by user or session timed out";
  const type = searchParams.get("type") || "Rent / Deposit";

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-black/5">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-transparent px-6 py-8 text-center sm:px-8">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber text-amber-foreground shadow-lg shadow-amber/20">
          <XCircle className="size-9 stroke-[2.2]" />
        </div>
        <Badge tone="warning" className="mt-4 px-3 py-1 font-semibold">
          Payment Incomplete
        </Badge>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Payment Cancelled</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The transaction was not finalized. No money was deducted from your account.
        </p>
      </div>

      {/* Details Box */}
      <div className="space-y-4 px-6 py-6 sm:px-8">
        <div className="rounded-2xl border border-border bg-muted/40 p-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Payment Context</span>
            <span className="font-medium text-foreground">{type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status Reason</span>
            <span className="font-medium text-foreground text-right">{reason}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Account Impact</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">৳0 Charged</span>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Need assistance or encountered a gateway problem? You can try another payment method or contact our support team.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-2.5 sm:flex-row">
          <Button asChild className="flex-1 rounded-xl" size="lg">
            <Link href="/tenant/payments">
              <RefreshCw className="size-4 mr-1.5" />
              Try Payment Again
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex-1 rounded-xl" size="lg">
            <Link href="/tenant">
              <ArrowLeft className="size-4 mr-1.5" />
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

