"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyImage } from "@/components/shared/property-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Swipeable gallery: native scroll-snap (touch swipe, trackpad, keyboard via the
 * buttons) with dots on mobile and thumbnails on larger screens.
 */
export function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const scroller = React.useRef<HTMLUListElement>(null);
  const [index, setIndex] = React.useState(0);

  const goTo = React.useCallback(
    (i: number) => {
      const el = scroller.current;
      if (!el) return;
      const next = Math.max(0, Math.min(images.length - 1, i));
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    },
    [images.length],
  );

  const onScroll = React.useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-border">
        <PropertyImage alt={title} sizes="100vw" />
      </div>
    );
  }

  return (
    <div className="grid gap-3" role="group" aria-roledescription="carousel" aria-label={`${title} photos`}>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
        <ul
          ref={scroller}
          onScroll={onScroll}
          className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
          tabIndex={0}
          aria-label="Photos. Swipe or use the arrow buttons."
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") goTo(index + 1);
            if (e.key === "ArrowLeft") goTo(index - 1);
          }}
        >
          {images.map((src, i) => (
            <li
              key={src + i}
              className="relative aspect-[4/3] w-full shrink-0 snap-center sm:aspect-[16/10]"
              aria-roledescription="slide"
              aria-label={`Photo ${i + 1} of ${images.length}`}
            >
              <PropertyImage
                src={src}
                alt={`${title}, photo ${i + 1}`}
                sizes="(min-width: 1024px) 760px, 100vw"
                priority={i === 0}
              />
            </li>
          ))}
        </ul>

        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous photo"
              disabled={index === 0}
              onClick={() => goTo(index - 1)}
              className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-card/90 backdrop-blur sm:inline-flex"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next photo"
              disabled={index === images.length - 1}
              onClick={() => goTo(index + 1)}
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-card/90 backdrop-blur sm:inline-flex"
            >
              <ChevronRight />
            </Button>
            <p className="num absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur" aria-hidden="true">
              {index + 1} / {images.length}
            </p>
          </>
        )}
      </div>

      {images.length > 1 && (
        <ul className="hidden gap-2 sm:flex" aria-label="Choose a photo">
          {images.map((src, i) => (
            <li key={src + i} className="w-24">
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "relative block aspect-[4/3] w-full overflow-hidden rounded-xl border-2 outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring",
                  i === index ? "border-primary" : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <PropertyImage src={src} alt="" sizes="96px" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 sm:hidden" aria-hidden="true">
          {images.map((_, i) => (
            <span key={i} className={cn("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-primary" : "w-1.5 bg-border")} />
          ))}
        </div>
      )}
    </div>
  );
}
