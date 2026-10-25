"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FieldProps {
  label: string;
  /** Optional hint shown under the control. */
  hint?: React.ReactNode;
  /** Validation message (e.g. react-hook-form `errors.x?.message`). */
  error?: string;
  required?: boolean;
  className?: string;
  /** React node or render function that receives ids/aria props */
  children:
    | React.ReactNode
    | ((props: {
        id: string;
        "aria-invalid": boolean;
        "aria-describedby": string | undefined;
      }) => React.ReactNode);
}

/**
 * Accessible labelled form field. Associates label, hint and error with the
 * control through ids and aria-describedby.
 */
export function Field({ label, hint, error, required, className, children }: FieldProps) {
  const uid = React.useId();
  const id = `field-${uid}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-danger-strong">
            *
          </span>
        )}
      </Label>
      {typeof children === "function"
        ? (children as Function)({ id, "aria-invalid": !!error, "aria-describedby": describedBy })
        : children}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-danger-strong">
          {error}
        </p>
      )}
    </div>
  );
}
