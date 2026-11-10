"use client";

import { GoogleButton, OrDivider } from "@/components/auth/google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/hooks/useAuthMutations";
import { loginSchema, type LoginValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home as HomeIcon, Loader2, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

export function LoginForm() {
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: "TENANT", email: "", password: "" },
  });

  const onSubmit = (v: LoginValues) => {
    loginMutation.mutate({
      email: v.email,
      password: v.password,
    });
  };

  const handleDemoLogin = (email: string, password: string, role: LoginValues["role"]) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
    setValue("role", role, { shouldValidate: true });
    loginMutation.mutate({ email, password });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome back</h1>
      <p className="mt-2 text-muted-foreground">Log in to manage your rooms, rent and roommates.</p>

      {/* 🚀 Mandatory One-Click Demo Login Section */}
      <div className="mt-6 rounded-2xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            1-Click Quick Demo Login
          </span>
          <span className="text-[11px] font-mono text-muted-foreground">Live API Connected</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Admin */}
          <button
            type="button"
            disabled={loginMutation.isPending}
            onClick={() => handleDemoLogin("admin@gmail.com", "Admin123@", "ADMIN")}
            className="group flex flex-col items-start gap-1 rounded-xl border border-border/80 bg-background/60 p-2.5 text-left transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
          >
            <div className="flex w-full items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-primary">
                <ShieldCheck className="size-3.5 text-primary shrink-0" />
                Admin
              </span>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                Platform
              </span>
            </div>
            <span className="line-clamp-1 text-[11px] text-muted-foreground">admin@gmail.com</span>
          </button>

          {/* Owner (Provider) */}
          <button
            type="button"
            disabled={loginMutation.isPending}
            onClick={() => handleDemoLogin("owner@gmail.com", "Owner123@", "OWNER")}
            className="group flex flex-col items-start gap-1 rounded-xl border border-border/80 bg-background/60 p-2.5 text-left transition-all hover:border-secondary/50 hover:bg-secondary/5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:opacity-50"
          >
            <div className="flex w-full items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-secondary">
                <HomeIcon className="size-3.5 text-secondary shrink-0" />
                Owner
              </span>
              <span className="rounded-md bg-secondary/10 px-1.5 py-0.5 text-[10px] font-semibold text-secondary">
                Provider
              </span>
            </div>
            <span className="line-clamp-1 text-[11px] text-muted-foreground">owner@gmail.com</span>
          </button>

          {/* Tenant (User) */}
          <button
            type="button"
            disabled={loginMutation.isPending}
            onClick={() => handleDemoLogin("tenant@gmail.com", "Tenant123@", "TENANT")}
            className="group flex flex-col items-start gap-1 rounded-xl border border-border/80 bg-background/60 p-2.5 text-left transition-all hover:border-teal-500/50 hover:bg-teal-500/5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:opacity-50"
          >
            <div className="flex w-full items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400">
                <UserCheck className="size-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                Tenant
              </span>
              <span className="rounded-md bg-teal-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700 dark:text-teal-300">
                User
              </span>
            </div>
            <span className="line-clamp-1 text-[11px] text-muted-foreground">tenant@gmail.com</span>
          </button>

          {/* Manager */}
          <button
            type="button"
            disabled={loginMutation.isPending}
            onClick={() => handleDemoLogin("manager@gmail.com", "Manager123@", "MANAGER")}
            className="group flex flex-col items-start gap-1 rounded-xl border border-border/80 bg-background/60 p-2.5 text-left transition-all hover:border-border hover:bg-muted/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground disabled:opacity-50"
          >
            <div className="flex w-full items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <UserCheck className="size-3.5 text-foreground shrink-0" />
                Manager
              </span>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                Staff
              </span>
            </div>
            <span className="line-clamp-1 text-[11px] text-muted-foreground">manager@gmail.com</span>
          </button>
        </div>
      </div>

      <div className="my-6">
        <OrDivider label="or sign in with email" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
        <Field label="Email" error={errors.email?.message}>
          <Input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={loginMutation.isPending}
            {...register("email")}
          />
        </Field>

        <Field
          label="Password"
          error={errors.password?.message}
          hint={
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          }
        >
          <PasswordInput
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={loginMutation.isPending}
            {...register("password")}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Signing in...
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>

      <div className="mt-6">
        <GoogleButton action="Sign in" />
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-foreground underline-offset-4 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
