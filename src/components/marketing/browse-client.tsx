"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SearchX, X } from "lucide-react";
import { BrowseFilters, RENT_MAX, type BrowseFilterState } from "@/components/marketing/browse-filters";
import { CardGridSkeleton } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterSheet } from "@/components/shared/filter-sheet";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { PropertyCard } from "@/components/shared/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBrowse } from "@/hooks/useBrowse";
import { listItemProps } from "@/lib/motion";
import { formatBDT, pluralize } from "@/lib/format";

export function BrowseClient() {
  const {
    filters,
    query,
    setQuery,
    page,
    setPage,
    pageCount,
    totalCount,
    visibleProperties,
    activeCount,
    updateFilters,
    resetFilters,
    isLoading,
  } = useBrowse();

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Desktop sidebar */}
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-bold">Filters</h2>
            {(activeCount > 0 || query) && (
              <Button variant="link" size="sm" onClick={resetFilters}>
                Clear all
              </Button>
            )}
          </div>
          <BrowseFilters value={filters} onChange={updateFilters} idPrefix="side" />
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              aria-label="Search by name or area"
              placeholder="Search by name, area or address"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <div className="lg:hidden">
              <FilterSheet activeCount={activeCount} onReset={resetFilters} description="Narrow the rooms by area, budget and amenities.">
                <BrowseFilters value={filters} onChange={updateFilters} idPrefix="sheet" />
              </FilterSheet>
            </div>
            <Select value={filters.sort} onValueChange={(v) => updateFilters({ ...filters, sort: v as BrowseFilterState["sort"] })}>
              <SelectTrigger aria-label="Sort results" className="w-full sm:w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="rent-asc">Rent: low to high</SelectItem>
                <SelectItem value="rent-desc">Rent: high to low</SelectItem>
                <SelectItem value="newest">Newest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filter chips */}
        {activeCount > 0 && !isLoading && (
          <ul className="mb-5 flex flex-wrap gap-2" aria-label="Active filters">
            {filters.area !== "any" && <Chip label={filters.area} onRemove={() => updateFilters({ ...filters, area: "any" })} />}
            {filters.roomType !== "any" && <Chip label={filters.roomType} onRemove={() => updateFilters({ ...filters, roomType: "any" })} />}
            {filters.maxRent < RENT_MAX && <Chip label={`Up to ${formatBDT(filters.maxRent)}`} onRemove={() => updateFilters({ ...filters, maxRent: RENT_MAX })} />}
            {filters.amenities.map((a) => (
              <Chip key={a} label={a} onRemove={() => updateFilters({ ...filters, amenities: filters.amenities.filter((x) => x !== a) })} />
            ))}
          </ul>
        )}

        {isLoading ? (
          <CardGridSkeleton count={6} className="lg:grid-cols-2 xl:grid-cols-3" />
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
              {pluralize(totalCount, "place")} found
            </p>
            {totalCount === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No rooms match these filters"
                description="Try a wider budget, remove an amenity or search a different area."
                action={<Button onClick={resetFilters}>Clear all filters</Button>}
              />
            ) : (
              <>
                <motion.ul layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {visibleProperties.map((p) => (
                      <motion.li key={p.id} {...listItemProps}>
                        <PropertyCard property={p} sizes="(min-width: 1280px) 340px, (min-width: 640px) 45vw, 92vw" />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
                <PaginationBar
                  page={page}
                  pageCount={pageCount}
                  onPageChange={(n) => {
                    setPage(n);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="mt-10"
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-teal-soft px-3 text-sm font-medium text-secondary outline-none transition-colors hover:bg-secondary/20 focus-visible:ring-2 focus-visible:ring-ring"
      >
        {label}
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </li>
  );
}
