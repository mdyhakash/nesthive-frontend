"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, FileText, ArrowRight, Printer, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBDT, formatDate } from "@/lib/format";

export function PaymentSuccessContent() {
  const searchParams = useSearchParams();

  const tranId =
    searchParams.get("tran_id") ||
    searchParams.get("trxId") ||
    searchParams.get("session_id") ||
    `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const amount = Number(searchParams.get("amount") || searchParams.get("total_amount") || "12500");
  const method = searchParams.get("method") || searchParams.get("card_type") || "bKash / Online Gateway";
  const type = searchParams.get("type") || "Rent Payment";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-black/5">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent px-6 py-8 text-center sm:px-8">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-success text-white shadow-lg shadow-success/20">
          <CheckCircle2 className="size-9 stroke-[2.2]" />
        </div>
        <Badge tone="success" className="mt-4 px-3 py-1 font-semibold">
          Payment Confirmed
        </Badge>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Payment Successful!</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Thank you. Your transaction has been completed and verified.
        </p>
      </div>

      {/* Receipt Details */}
      <div className="space-y-4 px-6 py-6 sm:px-8">
        <div className="rounded-2xl border border-border bg-muted/40 p-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="text-lg font-bold text-foreground num">{formatBDT(amount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Payment Type</span>
            <span className="font-medium text-foreground">{type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-mono text-xs font-semibold text-foreground">{tranId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="font-medium text-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-success" />
              {method}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Date & Time</span>
            <span className="font-medium text-foreground">{formatDate(new Date().toISOString())}</span>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          A receipt has been saved to your account. You can view it anytime in your payments dashboard.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-2.5 sm:flex-row">
          <Button asChild className="flex-1 rounded-xl" size="lg">
            <Link href="/tenant/payments">
              View Payment History
              <ArrowRight className="size-4 ml-1.5" />
            </Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            size="lg"
            onClick={handlePrint}
          >
            <Printer className="size-4 mr-1.5" />
            Print Receipt
          </Button>
        </div>
      </div>
    </div>
  );
}

