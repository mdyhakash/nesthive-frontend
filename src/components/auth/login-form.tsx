"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { GoogleButton, OrDivider } from "@/components/auth/google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { demoAccounts } from "@/data/users";
import { transition } from "@/lib/motion";
import { ROLE_DESCRIPTION, ROLE_HOME, ROLE_LABEL, ROLES } from "@/lib/roles";
import { loginSchema, type LoginValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

const DEMO_PASSWORD = "demo1234";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: "TENANT", email: "", password: "" },
  });

  const onSubmit = async (v: LoginValues) => {
    await new Promise((r) => setTimeout(r, 450)); // fake network
    login(v.role);
    toast.success(`Signed in as ${ROLE_LABEL[v.role]}`);
    router.push(ROLE_HOME[v.role]);
  };

  const fillDemo = (role: Role) => {
    setValue("role", role, { shouldValidate: true });
    setValue("email", demoAccounts[role].email, { shouldValidate: true });
    setValue("password", DEMO_PASSWORD, { shouldValidate: true });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome back</h1>
      <p className="mt-2 text-muted-foreground">Log in to manage your rooms, rent and roommates.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 grid gap-5">
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <fieldset className="grid min-w-0 gap-2">
              <legend className="mb-1 text-sm font-medium">I am a</legend>
              <div role="radiogroup" aria-label="Account type" className="grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1 sm:grid-cols-4">
                {ROLES.map((r) => {
                  const active = field.value === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => field.onChange(r)}
                      className={cn(
                        "relative min-h-11 rounded-xl px-2 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="login-role"
                          className="absolute inset-0 rounded-xl border border-border bg-card shadow-sm"
                          transition={transition.layout}
                        />
                      )}
                      <span className="relative">{ROLE_LABEL[r]}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground" aria-live="polite">
                {ROLE_DESCRIPTION[field.value]}
              </p>
            </fieldset>
          )}
        />

        <Field label="Email" required error={errors.email?.message}>
          {(a) => <Input type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" {...a} {...register("email")} />}
        </Field>
        <Field label="Password" required error={errors.password?.message}>
          {(a) => <PasswordInput autoComplete="current-password" {...a} {...register("password")} />}
        </Field>

        <div className="-mt-2 text-right">
          <Link href="/forgot-password" className="inline-flex min-h-11 items-center text-sm font-medium text-secondary underline-offset-4 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Log in"}
        </Button>
      </form>

      <OrDivider />
      <GoogleButton />

      <section aria-labelledby="demo" className="mt-8 rounded-2xl border border-dashed border-border bg-amber-soft p-4">
        <h2 id="demo" className="text-sm font-bold">
          Demo accounts
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">Nothing is saved. Pick a role to fill the form, then log in.</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {ROLES.map((r) => (
            <Button key={r} type="button" variant="outline" size="sm" onClick={() => fillDemo(r)} className="justify-start">
              {ROLE_LABEL[r]} demo
            </Button>
          ))}
        </div>
      </section>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to NestHive?{" "}
        <Link href="/register" className="font-semibold text-secondary underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
