import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[75dvh] flex-col items-center justify-center px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-3xl bg-amber-soft text-primary shadow-inner">
        <Compass className="size-10 stroke-[1.75]" aria-hidden="true" />
      </div>

      <span className="num mt-6 text-sm font-bold uppercase tracking-wider text-primary">
        404 — Page Not Found
      </span>

      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Looks like you took a wrong turn
      </h1>

      <p className="mt-3 max-w-md text-base text-muted-foreground sm:text-lg">
        The room, listing, or page you are looking for does not exist, has been removed, or the link is expired.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg" className="rounded-xl">
          <Link href="/browse">
            <Search className="size-4" aria-hidden="true" />
            Browse available rooms
          </Link>
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

