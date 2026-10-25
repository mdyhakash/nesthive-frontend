"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { OtpInput } from "@/components/auth/otp-input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatBDT } from "@/lib/format";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface CheckoutItem {
  /** What the person is paying for, e.g. "Rent · November 2026". */
  label: string;
  amount: number;
  /** Extra line (property, due date…). */
  detail?: string;
}

const slide = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: transition.base },
  exit: { opacity: 0, x: -24, transition: transition.fast },
};

type Step = "confirm" | "pin" | "otp" | "processing" | "success" | "failed";

const DEMO_PIN_OK = "12345";
const DEMO_PIN_FAIL = "00000";
const DEMO_OTP = "123456";
const DEFAULT_NUMBER = "01712345601";

function makeTrxId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "BK";
  for (let i = 0; i < 8; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

function BkashMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex size-9 items-center justify-center rounded-xl bg-white text-lg font-extrabold text-bkash", className)}
    >
      b
    </span>
  );
}

/**
 * Mock bKash checkout. Pink is reserved for this dialog.
 * Demo values: PIN 12345 succeeds, 00000 fails (insufficient balance), OTP 123456.
 */
export function BkashCheckout({
  open,
  onOpenChange,
  item,
  onSuccess,
  onFailure,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: CheckoutItem | null;
  /** Called once with the transaction id and the number used. */
  onSuccess: (trxId: string, number: string) => void;
  /** Called once when the payment fails so the caller can record it. */
  onFailure?: (number: string) => void;
}) {
  const [step, setStep] = React.useState<Step>("confirm");
  const [number, setNumber] = React.useState(DEFAULT_NUMBER);
  const [numberError, setNumberError] = React.useState("");
  const [pin, setPin] = React.useState("");
  const [pinError, setPinError] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [otpError, setOtpError] = React.useState("");
  const [trx, setTrx] = React.useState("");
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (open) {
      setStep("confirm");
      setNumber(DEFAULT_NUMBER);
      setNumberError("");
      setPin("");
      setPinError("");
      setOtp("");
      setOtpError("");
      setTrx("");
    }
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [open]);

  if (!item) return null;

  const locked = step === "processing";
  const masked = `${number.slice(0, 5)}-${number.slice(5)}`;

  const submitNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^01[3-9]\d{8}$/.test(number)) {
      setNumberError("Enter a valid 11-digit bKash number, e.g. 01712345601");
      return;
    }
    setNumberError("");
    setStep("pin");
  };

  const submitPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(pin)) {
      setPinError("Your bKash PIN is 5 digits");
      return;
    }
    setPinError("");
    if (pin === DEMO_PIN_FAIL) {
      setStep("processing");
      timer.current = window.setTimeout(() => {
        setStep("failed");
        onFailure?.(number);
      }, 1200);
      return;
    }
    if (pin !== DEMO_PIN_OK) {
      setPinError("Incorrect PIN. In this demo use 12345.");
      return;
    }
    setStep("otp");
  };

  const verifyOtp = (code: string) => {
    if (code !== DEMO_OTP) {
      setOtpError("That code didn't match. In this demo use 123456.");
      return;
    }
    setOtpError("");
    setStep("processing");
    timer.current = window.setTimeout(() => {
      const id = makeTrxId();
      setTrx(id);
      setStep("success");
      onSuccess(id, number);
    }, 1200);
  };

  const close = () => {
    if (!locked) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="max-w-md overflow-hidden p-0" showClose={false}>
        <div className="relative bg-bkash px-5 pb-5 pt-6 text-white">
          {!locked && step !== "success" && (
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-full text-white outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white"
            >
              ✕
            </button>
          )}
          <div className="flex items-center gap-3">
            <BkashMark />
            <div className="min-w-0 pr-8">
              <DialogTitle className="text-lg text-white">bKash Payment</DialogTitle>
              <DialogDescription className="text-white/85">Paying NestHive (merchant)</DialogDescription>
            </div>
          </div>
          <p className="num mt-4 text-3xl font-semibold">{formatBDT(item.amount)}</p>
          <p className="mt-0.5 text-sm text-white/85">{item.label}</p>
        </div>

        <div className="min-h-64 p-5">
          <AnimatePresence mode="wait" initial={false}>
            {step === "confirm" && (
              <motion.form key="confirm" {...slide} onSubmit={submitNumber} className="grid gap-4" noValidate>
                <div className="grid gap-2">
                  <Label htmlFor="bk-number">Your bKash account number</Label>
                  <Input
                    id="bk-number"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={11}
                    value={number}
                    onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
                    aria-invalid={!!numberError}
                    aria-describedby={numberError ? "bk-number-error" : undefined}
                    className="num"
                  />
                  {numberError && (
                    <p id="bk-number-error" role="alert" className="text-xs font-medium text-danger-strong">
                      {numberError}
                    </p>
                  )}
                </div>
                {item.detail && <p className="rounded-xl bg-bkash-soft px-4 py-3 text-sm">{item.detail}</p>}
                <Button type="submit" variant="bkash" size="lg">
                  Confirm
                </Button>
                <Button type="button" variant="ghost" onClick={close}>
                  Close
                </Button>
              </motion.form>
            )}

            {step === "pin" && (
              <motion.form key="pin" {...slide} onSubmit={submitPin} className="grid gap-4" noValidate>
                <div className="grid gap-2">
                  <Label htmlFor="bk-pin">Enter your bKash PIN for {masked}</Label>
                  <Input
                    id="bk-pin"
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={5}
                    autoFocus
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    aria-invalid={!!pinError}
                    aria-describedby="bk-pin-hint"
                    className="num text-center text-2xl tracking-[0.5em]"
                  />
                  <p id="bk-pin-hint" className={cn("text-xs", pinError ? "font-medium text-danger-strong" : "text-muted-foreground")} role={pinError ? "alert" : undefined}>
                    {pinError || "Demo: 12345 works. 00000 simulates a failed payment."}
                  </p>
                </div>
                <Button type="submit" variant="bkash" size="lg">
                  Continue
                </Button>
                <Button type="button" variant="ghost" onClick={() => setStep("confirm")}>
                  Back
                </Button>
              </motion.form>
            )}

            {step === "otp" && (
              <motion.div key="otp" {...slide} className="grid gap-4">
                <div>
                  <p className="font-semibold">Verification code</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We sent a 6-digit code to <span className="num font-medium text-foreground">{masked}</span>. Demo code: 123456.
                  </p>
                </div>
                <OtpInput value={otp} onChange={(v) => { setOtp(v); setOtpError(""); }} onComplete={verifyOtp} invalid={!!otpError} aria-describedby={otpError ? "bk-otp-error" : undefined} />
                {otpError && (
                  <p id="bk-otp-error" role="alert" className="text-xs font-medium text-danger-strong">
                    {otpError}
                  </p>
                )}
                <Button type="button" variant="bkash" size="lg" onClick={() => verifyOtp(otp)} disabled={otp.length < 6}>
                  Verify and pay {formatBDT(item.amount)}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setStep("pin")}>
                  Back
                </Button>
              </motion.div>
            )}

            {step === "processing" && (
              <motion.div key="processing" {...slide} role="status" className="flex min-h-56 flex-col items-center justify-center gap-3 text-center">
                <Loader2 className="size-10 animate-spin text-bkash" aria-hidden="true" />
                <p className="font-semibold">Processing your payment…</p>
                <p className="text-sm text-muted-foreground">Please don&apos;t close this window.</p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div key="success" {...slide} className="flex flex-col items-center gap-3 text-center">
                <motion.span
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                  className="flex size-16 items-center justify-center rounded-full bg-success-soft text-success-strong"
                >
                  <CheckCircle2 className="size-9" aria-hidden="true" />
                </motion.span>
                <h3 className="text-xl font-bold">Payment successful</h3>
                <p className="text-sm text-muted-foreground">
                  {formatBDT(item.amount)} sent to NestHive for {item.label}.
                </p>
                <dl className="mt-1 w-full rounded-xl bg-muted px-4 py-3 text-sm">
                  <div className="flex justify-between gap-3 py-1">
                    <dt className="text-muted-foreground">Transaction ID</dt>
                    <dd className="num font-semibold">{trx}</dd>
                  </div>
                  <div className="flex justify-between gap-3 py-1">
                    <dt className="text-muted-foreground">Paid from</dt>
                    <dd className="num font-semibold">{masked}</dd>
                  </div>
                </dl>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5" aria-hidden="true" /> Demo only. No money moved.
                </p>
                <Button type="button" size="lg" className="w-full" onClick={() => onOpenChange(false)}>
                  Done
                </Button>
              </motion.div>
            )}

            {step === "failed" && (
              <motion.div key="failed" {...slide} className="flex flex-col items-center gap-3 text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-danger-soft text-danger-strong">
                  <AlertCircle className="size-9" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-bold">Payment failed</h3>
                <p className="text-sm text-muted-foreground">
                  Your bKash account doesn&apos;t have enough balance for {formatBDT(item.amount)}. You were not charged.
                </p>
                <Button
                  type="button"
                  variant="bkash"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setPin("");
                    setStep("pin");
                  }}
                >
                  Try again
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
