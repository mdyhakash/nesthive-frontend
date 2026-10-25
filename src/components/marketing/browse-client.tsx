"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SearchX, X } from "lucide-react";
import { BrowseFilters, countActive, defaultFilters, RENT_MAX, type BrowseFilterState } from "@/components/marketing/browse-filters";
import { CardGridSkeleton } from "@/components/shared/data-table";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { FilterSheet } from "@/components/shared/filter-sheet";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { PropertyCard } from "@/components/shared/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { publicProperties } from "@/data/properties";
import { roomsForProperty } from "@/data/rooms";
import { useMockQuery } from "@/hooks/use-mock-query";
import { listItemProps } from "@/lib/motion";
import { formatBDT, pluralize } from "@/lib/format";

const PAGE_SIZE = 6;

function initialFilters(params: URLSearchParams): BrowseFilterState {
  const maxRent = Number(params.get("maxRent"));
  return {
    ...defaultFilters,
    area: params.get("area") ?? "any",
    roomType: params.get("roomType") ?? "any",
    maxRent: Number.isFinite(maxRent) && maxRent > 0 ? Math.min(maxRent, RENT_MAX) : RENT_MAX,
  };
}

export function BrowseClient() {
  const params = useSearchParams();
  const [filters, setFilters] = React.useState<BrowseFilterState>(() => initialFilters(params));
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const { status, retry } = useMockQuery(null);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = publicProperties.filter((p) => {
      if (q && !`${p.title} ${p.area} ${p.address}`.toLowerCase().includes(q)) return false;
      if (filters.area !== "any" && p.area !== filters.area) return false;
      if (filters.roomType !== "any" && !roomsForProperty(p.id).some((r) => r.type === filters.roomType && r.isPublished)) return false;
      // Property matches if its cheapest room fits the budget.
      if (p.rent > filters.maxRent) return false;
      if (!filters.amenities.every((a) => p.amenities.includes(a))) return false;
      return true;
    });
    const sorted = [...list];
    if (filters.sort === "rent-asc") sorted.sort((a, b) => a.rent - b.rent);
    else if (filters.sort === "rent-desc") sorted.sort((a, b) => b.rent - a.rent);
    else if (filters.sort === "newest") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else sorted.sort((a, b) => b.rating * Math.log(b.reviewCount + 2) - a.rating * Math.log(a.reviewCount + 2));
    return sorted;
  }, [filters, query]);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const active = countActive(filters);

  const update = (next: BrowseFilterState) => {
    setFilters(next);
    setPage(1);
  };
  const reset = () => {
    setFilters({ ...defaultFilters, sort: filters.sort });
    setQuery("");
    setPage(1);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Desktop sidebar */}
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-bold">Filters</h2>
            {(active > 0 || query) && (
              <Button variant="link" size="sm" onClick={reset}>
                Clear all
              </Button>
            )}
          </div>
          <BrowseFilters value={filters} onChange={update} idPrefix="side" />
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
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <div className="lg:hidden">
              <FilterSheet activeCount={active} onReset={reset} description="Narrow the rooms by area, budget and amenities.">
                <BrowseFilters value={filters} onChange={update} idPrefix="sheet" />
              </FilterSheet>
            </div>
            <Select value={filters.sort} onValueChange={(v) => update({ ...filters, sort: v as BrowseFilterState["sort"] })}>
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
        {active > 0 && status === "success" && (
          <ul className="mb-5 flex flex-wrap gap-2" aria-label="Active filters">
            {filters.area !== "any" && <Chip label={filters.area} onRemove={() => update({ ...filters, area: "any" })} />}
            {filters.roomType !== "any" && <Chip label={filters.roomType} onRemove={() => update({ ...filters, roomType: "any" })} />}
            {filters.maxRent < RENT_MAX && <Chip label={`Up to ${formatBDT(filters.maxRent)}`} onRemove={() => update({ ...filters, maxRent: RENT_MAX })} />}
            {filters.amenities.map((a) => (
              <Chip key={a} label={a} onRemove={() => update({ ...filters, amenities: filters.amenities.filter((x) => x !== a) })} />
            ))}
          </ul>
        )}

        {status === "loading" && <CardGridSkeleton count={6} className="lg:grid-cols-2 xl:grid-cols-3" />}
        {status === "error" && <ErrorState title="We couldn't load listings" onRetry={retry} />}
        {status === "success" && (
          <>
            <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
              {pluralize(results.length, "place")} found
            </p>
            {results.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No rooms match these filters"
                description="Try a wider budget, remove an amenity or search a different area."
                action={<Button onClick={reset}>Clear all filters</Button>}
              />
            ) : (
              <>
                <motion.ul layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {visible.map((p) => (
                      <motion.li key={p.id} {...listItemProps}>
                        <PropertyCard property={p} sizes="(min-width: 1280px) 340px, (min-width: 640px) 45vw, 92vw" />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
                <PaginationBar page={current} pageCount={pageCount} onPageChange={(n) => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="mt-10" />
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
