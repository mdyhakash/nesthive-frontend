"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { GoogleButton, OrDivider } from "@/components/auth/google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterValues } from "@/lib/validation";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS = [
  { value: "TENANT", label: "I'm looking for a room", hint: "Tenant" },
  { value: "OWNER", label: "I own a property", hint: "Owner" },
] as const;

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: params.get("role") === "OWNER" ? "OWNER" : "TENANT",
      name: "",
      email: "",
      phone: "",
      password: "",
      confirm: "",
      terms: false,
    },
  });

  const onSubmit = async (v: RegisterValues) => {
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Account created", { description: "We sent a 6-digit code to " + v.email });
    router.push(`/verify-email?email=${encodeURIComponent(v.email)}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Create your account</h1>
      <p className="mt-2 text-muted-foreground">Free for renters. Owners verify once, then list.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 grid gap-5">
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <div role="radiogroup" aria-label="Account type" className="grid gap-2 sm:grid-cols-2">
              {ROLE_OPTIONS.map((o) => {
                const active = field.value === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => field.onChange(o.value)}
                    className={cn(
                      "min-h-16 rounded-2xl border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                      active ? "border-secondary bg-teal-soft" : "border-border bg-card hover:bg-muted",
                    )}
                  >
                    <span className="block text-sm font-semibold">{o.label}</span>
                    <span className="text-xs text-muted-foreground">{o.hint} account</span>
                  </button>
                );
              })}
            </div>
          )}
        />

        <Field label="Full name" required error={errors.name?.message}>
          {(a) => <Input autoComplete="name" {...a} {...register("name")} />}
        </Field>
        <Field label="Email" required error={errors.email?.message}>
          {(a) => <Input type="email" inputMode="email" autoComplete="email" {...a} {...register("email")} />}
        </Field>
        <Field label="Mobile number" required hint="We use this for bKash payments and viewing updates." error={errors.phone?.message}>
          {(a) => <Input type="tel" inputMode="tel" autoComplete="tel" placeholder="01712-345678" {...a} {...register("phone")} />}
        </Field>
        <Field label="Password" required hint="At least 8 characters with a letter and a number." error={errors.password?.message}>
          {(a) => <PasswordInput autoComplete="new-password" {...a} {...register("password")} />}
        </Field>
        <Field label="Confirm password" required error={errors.confirm?.message}>
          {(a) => <PasswordInput autoComplete="new-password" {...a} {...register("confirm")} />}
        </Field>

        <Controller
          control={control}
          name="terms"
          render={({ field }) => (
            <div className="grid gap-1.5">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={field.value}
                  onCheckedChange={(c) => field.onChange(c === true)}
                  aria-invalid={!!errors.terms}
                  className="mt-0.5"
                />
                <label htmlFor="terms" className="text-sm leading-snug">
                  I agree to the NestHive terms of use and privacy policy.
                </label>
              </div>
              {errors.terms && (
                <p role="alert" className="text-xs font-medium text-danger-strong">
                  {errors.terms.message}
                </p>
              )}
            </div>
          )}
        />

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <OrDivider />
      <GoogleButton label="Sign up with Google" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-secondary underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
