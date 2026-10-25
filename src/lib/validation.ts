import { z } from "zod";

/** Bangladeshi mobile: 01XXXXXXXXX, optionally prefixed by +88 / 88; dashes and spaces ignored. */
const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;

export const phoneSchema = z
  .string()
  .min(1, "Enter your mobile number")
  .refine((v) => BD_PHONE.test(v.replace(/[\s-]/g, "")), "Enter a valid number, like 01712-345678");

export const emailSchema = z.string().min(1, "Enter your email").email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters")
  .regex(/[A-Za-z]/, "Include at least one letter")
  .regex(/\d/, "Include at least one number");

export const loginSchema = z.object({
  role: z.enum(["TENANT", "OWNER", "MANAGER", "ADMIN"]),
  email: emailSchema,
  password: z.string().min(1, "Enter your password"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    role: z.enum(["TENANT", "OWNER"]),
    name: z.string().min(2, "Enter your full name"),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirm: z.string().min(1, "Confirm your password"),
    terms: z.boolean().refine((v) => v, "Please accept the terms to continue"),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords don't match" });
export type RegisterValues = z.infer<typeof registerSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: emailSchema,
  topic: z.string().min(1, "Choose a topic"),
  message: z.string().min(10, "Tell us a bit more (at least 10 characters)").max(1000, "Keep it under 1000 characters"),
});
export type ContactValues = z.infer<typeof contactSchema>;
