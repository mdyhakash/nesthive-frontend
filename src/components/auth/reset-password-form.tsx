"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { passwordSchema } from "@/lib/validation";

const schema = z
  .object({ password: passwordSchema, confirm: z.string().min(1, "Confirm your new password") })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords don't match" });
type Values = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { password: "", confirm: "" } });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Password updated", { description: "Log in with your new password." });
    router.push("/login");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Choose a new password</h1>
      <p className="mt-2 text-muted-foreground">Pick something you haven&apos;t used on NestHive before.</p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 grid gap-5">
        <Field label="New password" required hint="At least 8 characters with a letter and a number." error={errors.password?.message}>
          {(a) => <PasswordInput autoComplete="new-password" {...a} {...register("password")} />}
        </Field>
        <Field label="Confirm new password" required error={errors.confirm?.message}>
          {(a) => <PasswordInput autoComplete="new-password" {...a} {...register("confirm")} />}
        </Field>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
