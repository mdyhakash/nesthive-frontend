import type { Property } from "@/types";

export const CITIES = ["Dhaka"] as const;

export const AREAS = [
  "Banani",
  "Dhanmondi",
  "Mirpur",
  "Uttara",
  "Gulshan",
  "Mohammadpur",
  "Bashundhara",
] as const;

export const AMENITIES = [
  "Wi-Fi",
  "Generator backup",
  "Lift",
  "Gas line",
  "CCTV",
  "Security guard",
  "Parking",
  "Balcony",
  "Furnished",
  "AC",
  "Filtered water",
  "Rooftop access",
  "Near metro",
  "Washing machine",
  "Geyser",
] as const;

export const PROPERTY_TYPES = ["Apartment", "Family flat", "Mess", "Sublet", "Studio"] as const;

/**
 * Backend-only data container (no static mock items)
 */
export const properties: Property[] = [];

export const getProperty = (id: string) => properties.find((p) => p.id === id);

/** Publicly visible: published, not soft-deleted. */
export const publicProperties: Property[] = [];
