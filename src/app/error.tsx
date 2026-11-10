"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error to monitoring if configured
    console.error("App boundary error caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[75dvh] flex-col items-center justify-center px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-3xl bg-danger-soft text-danger shadow-inner">
        <AlertTriangle className="size-10 stroke-[1.75]" aria-hidden="true" />
      </div>

      <span className="num mt-6 text-sm font-bold uppercase tracking-wider text-danger">
        Something went wrong
      </span>

      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        We encountered an unexpected error
      </h1>

      <p className="mt-3 max-w-md text-base text-muted-foreground sm:text-lg">
        {error.message || "An issue occurred while loading this view. You can retry or head back home."}
      </p>

      {error.digest && (
        <code className="mt-2 text-xs font-mono text-muted-foreground">
          Error Digest: {error.digest}
        </code>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()} size="lg" className="rounded-xl">
          <RefreshCw className="size-4" aria-hidden="true" />
          Try again
        </Button>

        <Button asChild variant="outline" size="lg" className="rounded-xl">
          <Link href="/">
            <Home className="size-4" aria-hidden="true" />
            Back to homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}

