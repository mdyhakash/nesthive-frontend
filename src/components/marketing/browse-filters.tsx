"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { AMENITIES, AREAS } from "@/data/properties";
import { formatBDT } from "@/lib/format";

export const RENT_MIN = 4000;
export const RENT_MAX = 30000;

export interface BrowseFilterState {
  area: string; // "any" or an area
  maxRent: number;
  amenities: string[];
  sort: "recommended" | "rent-asc" | "rent-desc" | "newest";
  roomType: string; // "any" or a room type
}

export const defaultFilters: BrowseFilterState = {
  area: "any",
  maxRent: RENT_MAX,
  amenities: [],
  sort: "recommended",
  roomType: "any",
};

export function countActive(f: BrowseFilterState) {
  return (
    (f.area !== "any" ? 1 : 0) +
    (f.maxRent < RENT_MAX ? 1 : 0) +
    (f.roomType !== "any" ? 1 : 0) +
    f.amenities.length
  );
}

const ROOM_TYPES = ["Single", "Shared", "Master bedroom", "Seat"];

/** The same controls render in the desktop sidebar and the mobile bottom sheet. */
export function BrowseFilters({
  value,
  onChange,
  idPrefix,
}: {
  value: BrowseFilterState;
  onChange: (next: BrowseFilterState) => void;
  idPrefix: string;
}) {
  const set = <K extends keyof BrowseFilterState>(key: K, v: BrowseFilterState[K]) => onChange({ ...value, [key]: v });

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-area`}>Area</Label>
        <Select value={value.area} onValueChange={(v) => set("area", v)}>
          <SelectTrigger id={`${idPrefix}-area`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">All areas</SelectItem>
            {AREAS.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-type`}>Room type</Label>
        <Select value={value.roomType} onValueChange={(v) => set("roomType", v)}>
          <SelectTrigger id={`${idPrefix}-type`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any room type</SelectItem>
            {ROOM_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <div className="flex items-baseline justify-between">
          <Label id={`${idPrefix}-rent-label`}>Max rent</Label>
          <span className="num text-sm font-semibold">{formatBDT(value.maxRent)}</span>
        </div>
        <Slider
          aria-labelledby={`${idPrefix}-rent-label`}
          min={RENT_MIN}
          max={RENT_MAX}
          step={500}
          value={[value.maxRent]}
          onValueChange={([v]) => set("maxRent", v)}
        />
        <div className="num flex justify-between text-xs text-muted-foreground">
          <span>{formatBDT(RENT_MIN)}</span>
          <span>{formatBDT(RENT_MAX)}</span>
        </div>
      </div>

      <fieldset className="grid min-w-0 gap-1">
        <legend className="mb-2 text-sm font-medium">Amenities</legend>
        {AMENITIES.map((a) => {
          const id = `${idPrefix}-am-${a.replace(/\s+/g, "-")}`;
          const checked = value.amenities.includes(a);
          return (
            <div key={a} className="flex min-h-11 items-center gap-3">
              <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={(c) =>
                  set("amenities", c === true ? [...value.amenities, a] : value.amenities.filter((x) => x !== a))
                }
              />
              <Label htmlFor={id} className="flex-1 cursor-pointer py-2 font-normal">
                {a}
              </Label>
            </div>
          );
        })}
      </fieldset>
    </div>
  );
}
