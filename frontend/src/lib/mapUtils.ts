import type { Listing, ListingType } from "../types/listing";

export const MAP_CENTER = { lat: 1.352, lng: 103.82 };
export const MAP_ZOOM = 12;

// Hard bounds — prevents panning outside Singapore
export const SINGAPORE_BOUNDS = {
  sw: [1.1304, 103.595] as [number, number],
  ne: [1.4784, 104.095] as [number, number],
};

export type PinVariant = ListingType | "sgculturepass";

export function getPinVariant(listing: Listing): PinVariant {
  if (listing.source === "sgculturepass") return "sgculturepass";
  return listing.type;
}

export const PIN_COLORS: Record<
  PinVariant,
  { bg: string; ring: string; glow: string }
> = {
  food: {
    bg: "#f97316",
    ring: "rgba(249,115,22,0.35)",
    glow: "rgba(249,115,22,0.2)",
  },
  event: {
    bg: "#0ea5e9",
    ring: "rgba(14,165,233,0.35)",
    glow: "rgba(14,165,233,0.2)",
  },
  sgculturepass: {
    bg: "#7c3aed",
    ring: "rgba(124,58,237,0.35)",
    glow: "rgba(124,58,237,0.2)",
  },
};

export const SOURCE_COLORS: Record<string, string> = {
  NEA: "#65a30d",
  NParks: "#059669",
  SBG: "#059669",
  Esplanade: "#7c3aed",
  STB: "#ea580c",
};
