import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useProperties } from "./useProperties";
import { publicProperties } from "@/data/properties";
import type { Property } from "@/types";
import { roomsForProperty } from "@/data/rooms";
import { defaultFilters, RENT_MAX, type BrowseFilterState, countActive } from "@/components/marketing/browse-filters";

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

export function useBrowse() {
  const params = useSearchParams();
  const [filters, setFilters] = React.useState<BrowseFilterState>(() => initialFilters(params));
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  // TanStack Query connected to live Backend
  const { data: apiData, isLoading: isApiLoading } = useProperties({
    searchTerm: query.trim() || undefined,
    area: filters.area !== "any" ? filters.area : undefined,
    maxRent: filters.maxRent < RENT_MAX ? filters.maxRent : undefined,
  });

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    
    // Check if backend returned any properties
    const backendItems = apiData?.data;
    let baseList: Property[] = publicProperties;

    if (Array.isArray(backendItems) && backendItems.length > 0) {
      // Map backend property items to compatible property shape
      const mappedBackend: Property[] = backendItems.map((b) => ({
        id: b.id,
        title: b.title,
        description: b.description || "",
        address: b.address,
        area: b.area,
        city: b.city,
        type: "Apartment",
        rent: b.rooms?.[0]?.rentAmount || 10000,
        bedrooms: b.rooms?.length || 2,
        bathrooms: 1,
        sizeSqft: 600,
        rating: 4.8,
        reviewCount: 12,
        verified: true,
        isAvailable: true,
        amenities: (b.amenities as any) || ["WIFI", "GENERATOR"],
        images: b.images && b.images.length > 0 ? b.images : [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80",
        ],
        ownerId: b.ownerId,
        createdAt: b.createdAt,
        status: "PUBLISHED",
        isDeleted: false,
      }));

      // Combine backend items with existing public mock listings (avoid duplicate IDs)
      const existingIds = new Set(mappedBackend.map((m) => m.id));
      baseList = [...mappedBackend, ...publicProperties.filter((p) => !existingIds.has(p.id))];
    }

    const list = baseList.filter((p) => {
      if (q && !`${p.title} ${p.area} ${p.address}`.toLowerCase().includes(q)) return false;
      if (filters.area !== "any" && p.area !== filters.area) return false;
      if (
        filters.roomType !== "any" &&
        !roomsForProperty(p.id).some((r) => r.type === filters.roomType && r.isPublished)
      ) {
        return false;
      }
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
  }, [filters, query, apiData]);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const activeCount = countActive(filters);

  const updateFilters = (next: BrowseFilterState) => {
    setFilters(next);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({ ...defaultFilters, sort: filters.sort });
    setQuery("");
    setPage(1);
  };

  return {
    filters,
    query,
    setQuery,
    page: current,
    setPage,
    pageCount,
    totalCount: results.length,
    visibleProperties: visible,
    activeCount,
    updateFilters,
    resetFilters,
    isLoading: isApiLoading,
  };
}
