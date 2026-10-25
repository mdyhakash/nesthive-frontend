"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Inbox } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { emailSchema } from "@/lib/validation";

const schema = z.object({ email: emailSchema });
type Values = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = React.useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = async (v: Values) => {
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Reset link sent");
    setSentTo(v.email);
  };

  if (sentTo) {
    return (
      <div>
        <span className="flex size-14 items-center justify-center rounded-2xl bg-teal-soft text-secondary">
          <Inbox className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-3xl font-bold">Check your inbox</h1>
        <p className="mt-2 text-muted-foreground">
          If an account exists for <span className="font-semibold text-foreground">{sentTo}</span>, a reset link is on its way.
        </p>
        <Button asChild size="lg" className="mt-8 w-full">
          <Link href="/reset-password">Open the reset link (demo)</Link>
        </Button>
        <Button variant="ghost" className="mt-2 w-full" onClick={() => setSentTo(null)}>
          Use a different email
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Forgot your password?</h1>
      <p className="mt-2 text-muted-foreground">Enter your email and we&apos;ll send you a link to choose a new one.</p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 grid gap-5">
        <Field label="Email" required error={errors.email?.message}>
          {(a) => <Input type="email" inputMode="email" autoComplete="email" {...a} {...register("email")} />}
        </Field>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>
      <Link href="/login" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-secondary underline-offset-4 hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to log in
      </Link>
    </div>
  );
}
