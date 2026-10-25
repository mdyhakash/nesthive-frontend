"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PasswordInput } from "@/components/auth/password-input";
import { useAuth } from "@/components/auth-provider";
import { useData } from "@/components/data-provider";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { UserAvatar } from "@/components/shared/user-avatar";
import { SectionCard } from "@/components/portal/section-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMockQuery } from "@/hooks/use-mock-query";
import { ErrorState } from "@/components/shared/empty-state";
import { ROLE_LABEL } from "@/lib/roles";
import { emailSchema, passwordSchema, phoneSchema } from "@/lib/validation";

const profileSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  phone: phoneSchema,
  email: emailSchema,
});
type ProfileValues = z.infer<typeof profileSchema>;

const passwordFormSchema = z
  .object({
    current: z.string().min(1, "Enter your current password"),
    next: passwordSchema,
    confirm: z.string().min(1, "Repeat the new password"),
  })
  .refine((v) => v.next === v.confirm, { path: ["confirm"], message: "The passwords don't match" })
  .refine((v) => v.next !== v.current, { path: ["next"], message: "Choose a password you haven't used here" });
type PasswordValues = z.infer<typeof passwordFormSchema>;

/** Profile page shared by every role: edit details, avatar preview, change password, deactivate. */
export function ProfileView() {
  const { user, role, logout } = useAuth();
  const d = useData();
  const router = useRouter();
  const { status, retry } = useMockQuery(null);
  const [avatar, setAvatar] = React.useState<string | undefined>();
  const [avatarError, setAvatarError] = React.useState("");
  const [confirm, setConfirm] = React.useState(false);

  const profile = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? "", phone: user?.phone ?? "", email: user?.email ?? "" },
  });
  const pw = useForm<PasswordValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { current: "", next: "", confirm: "" },
  });

  React.useEffect(() => () => {
    if (avatar) URL.revokeObjectURL(avatar);
  }, [avatar]);

  if (!user) return null;

  const saveProfile = async (v: ProfileValues) => {
    await new Promise((r) => setTimeout(r, 400));
    d.setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, name: v.name, phone: v.phone, email: v.email } : u)));
    toast.success("Profile updated");
  };

  const changePassword = async () => {
    await new Promise((r) => setTimeout(r, 400));
    pw.reset();
    toast.success("Password changed", { description: "Use your new password next time you sign in." });
  };

  const pickAvatar = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setAvatarError("Please choose an image file.");
    if (file.size > 3 * 1024 * 1024) return setAvatarError("Choose a photo under 3 MB.");
    setAvatarError("");
    setAvatar(URL.createObjectURL(file));
    toast.success("Photo preview updated");
  };

  return (
    <>
      <PageHeader title="Profile" description="Keep your details up to date so owners and managers can reach you." />

      {status === "loading" && (
        <div role="status" aria-label="Loading" className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <span className="sr-only">Loading…</span>
        </div>
      )}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "success" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Personal details" className="lg:row-span-1">
            <div className="mb-5 flex items-center gap-4">
              <UserAvatar name={user.name} src={avatar} size="xl" />
              <div className="min-w-0">
                <p className="truncate font-bold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{role ? ROLE_LABEL[role] : ""}</p>
                <label
                  htmlFor="avatar-input"
                  className="mt-2 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-border px-3 text-sm font-medium transition-colors hover:bg-muted focus-within:ring-2 focus-within:ring-ring"
                >
                  <Camera className="size-4" aria-hidden="true" />
                  Change photo
                  <input id="avatar-input" type="file" accept="image/*" className="sr-only" onChange={(e) => pickAvatar(e.target.files?.[0])} />
                </label>
                {avatarError && (
                  <p role="alert" className="mt-1 text-xs font-medium text-danger-strong">
                    {avatarError}
                  </p>
                )}
              </div>
            </div>
            <form onSubmit={profile.handleSubmit(saveProfile)} noValidate className="grid gap-4">
              <Field label="Full name" required error={profile.formState.errors.name?.message}>
                {(a) => <Input autoComplete="name" {...a} {...profile.register("name")} />}
              </Field>
              <Field label="Mobile number" required error={profile.formState.errors.phone?.message}>
                {(a) => <Input type="tel" autoComplete="tel" inputMode="tel" {...a} {...profile.register("phone")} />}
              </Field>
              <Field label="Email" required error={profile.formState.errors.email?.message}>
                {(a) => <Input type="email" autoComplete="email" {...a} {...profile.register("email")} />}
              </Field>
              <Button type="submit" disabled={profile.formState.isSubmitting} className="justify-self-start">
                {profile.formState.isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </form>
          </SectionCard>

          <div className="grid content-start gap-4">
            <SectionCard title="Change password">
              <form onSubmit={pw.handleSubmit(changePassword)} noValidate className="grid gap-4">
                <Field label="Current password" required error={pw.formState.errors.current?.message}>
                  {(a) => <PasswordInput autoComplete="current-password" {...a} {...pw.register("current")} />}
                </Field>
                <Field label="New password" required hint="At least 8 characters, with a letter and a number." error={pw.formState.errors.next?.message}>
                  {(a) => <PasswordInput autoComplete="new-password" {...a} {...pw.register("next")} />}
                </Field>
                <Field label="Repeat new password" required error={pw.formState.errors.confirm?.message}>
                  {(a) => <PasswordInput autoComplete="new-password" {...a} {...pw.register("confirm")} />}
                </Field>
                <Button type="submit" variant="secondary" disabled={pw.formState.isSubmitting} className="justify-self-start">
                  {pw.formState.isSubmitting ? "Updating…" : "Update password"}
                </Button>
              </form>
            </SectionCard>

            <SectionCard title="Deactivate account" description="Your listings, leases and history are kept, but you will be signed out and hidden from others.">
              <Button variant="destructive" onClick={() => setConfirm(true)}>
                Deactivate my account
              </Button>
            </SectionCard>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Deactivate your account?"
        description="You'll be signed out right away. In this demo nothing is actually deleted, and you can sign in again from the login page."
        confirmLabel="Deactivate account"
        cancelLabel="Keep my account"
        onConfirm={() => {
          toast.success("Account deactivated");
          logout();
          router.push("/");
        }}
      />
    </>
  );
}
