"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GoogleButton, OrDivider } from "@/components/auth/google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginValues } from "@/lib/validation";
import { useLoginMutation } from "@/hooks/useAuthMutations";
import { ShieldCheck, Home as HomeIcon, UserCheck, Loader2 } from "lucide-react";

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
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            🚀 1-Click Quick Demo Login
          </span>
          <span className="text-xs text-muted-foreground font-mono">Live API Connected</span>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loginMutation.isPending}
            onClick={() => handleDemoLogin("admin@gmail.com", "Admin123@", "ADMIN")}
            className="flex items-center justify-center gap-1.5 border-border hover:border-primary hover:bg-primary/5 text-xs font-semibold h-10 rounded-xl"
          >
            <ShieldCheck className="size-3.5 text-primary" />
            Admin Demo
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loginMutation.isPending}
            onClick={() => handleDemoLogin("owner@gmail.com", "Owner123@", "OWNER")}
            className="flex items-center justify-center gap-1.5 border-border hover:border-secondary hover:bg-secondary/5 text-xs font-semibold h-10 rounded-xl"
          >
            <HomeIcon className="size-3.5 text-secondary" />
            Owner Demo
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loginMutation.isPending}
            onClick={() => handleDemoLogin("manager@gmail.com", "Manager123@", "MANAGER")}
            className="flex items-center justify-center gap-1.5 border-border hover:border-accent-foreground text-xs font-semibold h-10 rounded-xl"
          >
            <UserCheck className="size-3.5 text-foreground" />
            Manager Demo
          </Button>
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
