"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({ reason: z.string().min(10, "Give a short reason (at least 10 characters)").max(300, "Keep it under 300 characters") });
type Values = z.infer<typeof schema>;

/** Reject flow: always asks for a reason the other person will see. */
export function RejectDialog({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description: string;
  onSubmit: (reason: string) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { reason: "" } });

  React.useEffect(() => {
    if (open) reset({ reason: "" });
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          noValidate
          onSubmit={handleSubmit((v) => {
            onSubmit(v.reason.trim());
            onOpenChange(false);
          })}
          className="grid gap-4"
        >
          <Field label="Reason" required error={errors.reason?.message}>
            {(a) => <Textarea rows={4} {...a} {...register("reason")} />}
          </Field>
          <DialogFooter className="mt-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive">
              Reject
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
