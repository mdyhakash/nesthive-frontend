"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  invalid?: boolean;
  disabled?: boolean;
  /** Called once when every digit has been entered. */
  onComplete?: (value: string) => void;
  "aria-describedby"?: string;
}

/**
 * Segmented one-time-code input: auto-advance, backspace to go back, arrow keys,
 * and paste of a full code. Works as a single logical field for screen readers.
 */
export function OtpInput({ value, onChange, length = 6, invalid, disabled, onComplete, ...rest }: OtpInputProps) {
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const focus = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const commit = (next: string) => {
    const clean = next.replace(/\D/g, "").slice(0, length);
    onChange(clean);
    if (clean.length === length) onComplete?.(clean);
  };

  return (
    <div role="group" aria-label="One-time code" aria-describedby={rest["aria-describedby"]} className="flex justify-between gap-2 sm:gap-3">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={invalid}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const ch = e.target.value.replace(/\D/g, "").slice(-1);
            const arr = digits.slice();
            arr[i] = ch;
            commit(arr.join(""));
            if (ch) focus(i + 1);
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i]) {
              e.preventDefault();
              const arr = digits.slice();
              arr[i - 1] = "";
              onChange(arr.join("").replace(/\D/g, ""));
              focus(i - 1);
            } else if (e.key === "ArrowLeft") focus(i - 1);
            else if (e.key === "ArrowRight") focus(i + 1);
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text");
            commit(pasted);
            focus(Math.min(pasted.replace(/\D/g, "").length, length - 1));
          }}
          className={cn(
            "num h-14 w-0 min-w-0 flex-1 rounded-xl border border-input bg-card text-center text-xl font-semibold outline-none transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-50",
            invalid && "border-danger focus-visible:border-danger focus-visible:ring-danger/20",
          )}
        />
      ))}
    </div>
  );
}
