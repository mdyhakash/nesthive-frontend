import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseClient } from "@/components/marketing/browse-client";
import { CardGridSkeleton } from "@/components/shared/data-table";

export const metadata: Metadata = {
  title: "Browse rooms in Dhaka",
  description: "Search verified rooms and flats across Banani, Dhanmondi, Mirpur, Uttara, Gulshan, Mohammadpur and Bashundhara.",
};

export default function BrowsePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-section">Browse rooms in Dhaka</h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Every place below is listed by a verified owner. Filter by area, budget and what matters to you.
        </p>
      </div>
      {/* useSearchParams needs a Suspense boundary so the page can still prerender. */}
      <Suspense fallback={<CardGridSkeleton count={6} />}>
        <BrowseClient />
      </Suspense>
    </div>
  );
}
