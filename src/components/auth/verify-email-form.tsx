"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";
import { OtpInput } from "@/components/auth/otp-input";
import { Button } from "@/components/ui/button";

/** Demo only: the one valid code. */
const DEMO_CODE = "123456";
const RESEND_SECONDS = 30;

export function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "your email";

  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [seconds, setSeconds] = React.useState(RESEND_SECONDS);

  React.useEffect(() => {
    if (seconds <= 0) return;
    const id = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [seconds]);

  const verify = async (value: string) => {
    if (value.length < 6) {
      setError("Enter all 6 digits");
      return;
    }
    setBusy(true);
    setError("");
    await new Promise((r) => setTimeout(r, 500));
    setBusy(false);
    if (value !== DEMO_CODE) {
      setError("That code isn't right. Check the email and try again.");
      return;
    }
    toast.success("Email verified", { description: "You can log in now." });
    router.push("/login");
  };

  return (
    <div>
      <span className="flex size-14 items-center justify-center rounded-2xl bg-teal-soft text-secondary">
        <MailCheck className="size-7" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-3xl font-bold">Check your email</h1>
      <p className="mt-2 text-muted-foreground">
        We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>. It expires in 10 minutes.
      </p>

      <form
        className="mt-8 grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          verify(code);
        }}
        noValidate
      >
        <OtpInput
          value={code}
          onChange={(v) => {
            setCode(v);
            if (error) setError("");
          }}
          onComplete={verify}
          invalid={!!error}
          disabled={busy}
          aria-describedby={error ? "otp-error" : "otp-hint"}
        />
        {error ? (
          <p id="otp-error" role="alert" className="text-sm font-medium text-danger-strong">
            {error}
          </p>
        ) : (
          <p id="otp-hint" className="rounded-xl bg-amber-soft px-3 py-2 text-xs text-muted-foreground">
            Demo: the code is <span className="num font-semibold text-foreground">123456</span>.
          </p>
        )}
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? "Verifying…" : "Verify email"}
        </Button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-1 text-sm text-muted-foreground">
        {seconds > 0 ? (
          <p aria-live="polite">
            Resend code in <span className="num font-semibold text-foreground">{seconds}s</span>
          </p>
        ) : (
          <Button
            variant="link"
            onClick={() => {
              setSeconds(RESEND_SECONDS);
              setCode("");
              setError("");
              toast.success("New code sent", { description: "Check " + email });
            }}
          >
            Send a new code
          </Button>
        )}
        <Link href="/register" className="inline-flex min-h-11 items-center font-medium text-secondary underline-offset-4 hover:underline">
          Use a different email
        </Link>
      </div>
    </div>
  );
}
