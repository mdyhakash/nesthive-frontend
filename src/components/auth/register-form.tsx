"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { GoogleButton, OrDivider } from "@/components/auth/google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterValues } from "@/lib/validation";
import { useRegisterMutation } from "@/hooks/useAuthMutations";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS = [
  { value: "TENANT", label: "I'm looking for a room", hint: "Tenant" },
  { value: "OWNER", label: "I own a property", hint: "Owner" },
] as const;

export function RegisterForm() {
  const params = useSearchParams();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
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

  const onSubmit = (v: RegisterValues) => {
    registerMutation.mutate({
      name: v.name,
      email: v.email,
      phone: v.phone,
      password: v.password,
    });
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
              {ROLE_OPTIONS.map((opt) => {
                const checked = field.value === opt.value;
                return (
                  <button
                    type="button"
                    role="radio"
                    key={opt.value}
                    aria-checked={checked}
                    onClick={() => field.onChange(opt.value)}
                    className={cn(
                      "flex flex-col items-start rounded-2xl border p-4 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      checked ? "border-primary bg-amber-soft/50 dark:bg-amber-soft/20" : "border-border hover:bg-muted",
                    )}
                  >
                    <span className="text-sm font-bold">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{opt.hint}</span>
                  </button>
                );
              })}
            </div>
          )}
        />

        <Field label="Full name" error={errors.name?.message}>
          <Input placeholder="Rahim Ahmed" disabled={registerMutation.isPending} {...register("name")} />
        </Field>

        <Field label="Email" error={errors.email?.message}>
          <Input type="email" placeholder="you@example.com" disabled={registerMutation.isPending} {...register("email")} />
        </Field>

        <Field label="Phone number" error={errors.phone?.message} hint="Used for viewing coordination & SMS OTP">
          <Input type="tel" placeholder="017XXXXXXXX" disabled={registerMutation.isPending} {...register("phone")} />
        </Field>

        <Field label="Password" error={errors.password?.message} hint="At least 8 characters">
          <PasswordInput placeholder="••••••••" disabled={registerMutation.isPending} {...register("password")} />
        </Field>

        <Field label="Confirm password" error={errors.confirm?.message}>
          <PasswordInput placeholder="••••••••" disabled={registerMutation.isPending} {...register("confirm")} />
        </Field>

        <Controller
          control={control}
          name="terms"
          render={({ field }) => (
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={!!errors.terms}
                disabled={registerMutation.isPending}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground leading-snug">
                I agree to the{" "}
                <Link href="#" className="underline-offset-4 hover:underline text-foreground">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline-offset-4 hover:underline text-foreground">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>
          )}
        />
        {errors.terms && <p className="text-xs font-medium text-danger">{errors.terms.message}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <div className="mt-6">
        <OrDivider label="or sign up with" />
      </div>

      <div className="mt-6">
        <GoogleButton action="Sign up" />
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-foreground underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
