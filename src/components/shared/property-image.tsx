"use client";

import * as React from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { blurDataURL } from "@/data/images";
import { cn } from "@/lib/utils";

interface PropertyImageProps {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * next/image fill wrapper. The parent must be `relative` with a fixed aspect.
 * Shows a blur placeholder while loading and a tinted fallback if the photo fails.
 */
export function PropertyImage({ src, alt, sizes, priority, className }: PropertyImageProps) {
  const [failed, setFailed] = React.useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("flex size-full items-center justify-center bg-gradient-to-br from-amber-soft to-teal-soft", className)}
      >
        <ImageOff className="size-7 text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  const local = src.startsWith("blob:");

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={local}
      placeholder={local ? "empty" : "blur"}
      blurDataURL={local ? undefined : blurDataURL}
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
