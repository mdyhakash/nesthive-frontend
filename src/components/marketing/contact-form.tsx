"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactValues } from "@/lib/validation";
import { transition } from "@/lib/motion";

const TOPICS = ["Finding a room", "Listing a property", "Payments and bKash", "Roommate matching", "Something else"];

export function ContactForm() {
  const [sent, setSent] = React.useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", topic: "", message: "" },
  });

  const onSubmit = async (v: ContactValues) => {
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Message sent", { description: "We&apos;ll reply to " + v.email + " within one working day." });
    setSent(v.email);
    reset();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: transition.base }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 py-10 text-center"
            role="status"
          >
            <CheckCircle2 className="size-12 text-success" aria-hidden="true" />
            <h2 className="text-2xl font-bold">Thanks, we have your message</h2>
            <p className="max-w-sm text-muted-foreground">We&apos;ll reply to {sent} within one working day.</p>
            <Button variant="outline" className="mt-3" onClick={() => setSent(null)}>
              Send another message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="grid gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: transition.base }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-xl font-bold">Send us a message</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name" required error={errors.name?.message}>
                {(a) => <Input autoComplete="name" {...a} {...register("name")} />}
              </Field>
              <Field label="Email" required error={errors.email?.message}>
                {(a) => <Input type="email" inputMode="email" autoComplete="email" {...a} {...register("email")} />}
              </Field>
            </div>
            <Field label="Topic" required error={errors.topic?.message}>
              {(a) => (
                <Controller
                  control={control}
                  name="topic"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger {...a}>
                        <SelectValue placeholder="What is this about?" />
                      </SelectTrigger>
                      <SelectContent>
                        {TOPICS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
            </Field>
            <Field label="Message" required error={errors.message?.message}>
              {(a) => <Textarea rows={6} {...a} {...register("message")} />}
            </Field>
            <Button type="submit" size="lg" disabled={isSubmitting} className="sm:justify-self-start">
              {isSubmitting ? "Sending…" : "Send message"}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
