export type ListingType = "food" | "event";
export type DistanceOption = "500m" | "1km" | "2km" | "5km";

export interface GeocodedFriend {
  address: string;
  resolved_address: string;
  lat: number;
  lng: number;
}

export interface MeetupResponse {
  centroid: { lat: number; lng: number };
  friends: GeocodedFriend[];
  results: Listing[];
}

interface CommuteInfo {
  times_min: (number | null)[];
  max_time_min: number | null;
  fairness_score: number | null;
}

export interface Listing {
  id: string;
  name: string;
  type: ListingType;
  lat: number;
  lng: number;
  price_min: number | null;
  price_max: number | null;
  tags: string[];
  source: string;
  image_url: string;
  description?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  source_url?: string | null;
  commutes?: {
    pt: CommuteInfo;
    drive: CommuteInfo;
    walk: CommuteInfo;
  };
}

export interface Filters {
  showFood: boolean;
  showEvents: boolean;
  showSGCP: boolean;      // SG Culture Pass events (source === "SGCulturePass")
  maxPrice: number;
  distance: DistanceOption;
}
