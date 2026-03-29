import { useState, useMemo, useCallback, useEffect } from "react";
import { SlidersHorizontal, List } from "lucide-react";
import type { Filters, Listing, MeetupResponse } from "../types/listing";
import { FilterSidebar } from "../components/map/FilterSidebar";
import { MapView } from "../components/map/MapView";
import { ListingDrawer } from "../components/map/ListingDrawer";
import { ListingsPanel } from "../components/map/ListingsPanel";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const DEFAULT_FILTERS: Filters = {
  showFood: true,
  showEvents: true,
  showSGCP: true,
  maxPrice: 200,
  distance: "2km",
};

function isSGCP(l: Listing) {
  return l.source === "sgculturepass";
}

const DISTANCE_TO_KM: Record<string, number> = {
  "500m": 0.5,
  "1km": 1.0,
  "2km": 2.0,
  "5km": 5.0,
};

export default function MapPage() {
  const isMobile = useIsMobile();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Listings from API
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Meetup state
  const [addresses, setAddresses] = useState<string[]>([]);
  const [meetupResult, setMeetupResult] = useState<MeetupResponse | null>(null);
  const [isMeetupLoading, setIsMeetupLoading] = useState(false);
  const [meetupError, setMeetupError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/listings`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load listings (${res.status})`);
        return res.json();
      })
      .then((data: Record<string, unknown>[]) => {
        const mapped: Listing[] = data
          .filter((r) => r.lat != null && r.lng != null)
          .map((r) => ({
            id: r.id as string,
            name: r.name as string,
            type: r.type as Listing["type"],
            lat: r.lat as number,
            lng: r.lng as number,
            price_min: r.price_min != null ? Math.round((r.price_min as number) / 100) : null,
            price_max: r.price_max != null ? Math.round((r.price_max as number) / 100) : (r.price_min != null ? Math.round((r.price_min as number) / 100) : null),
            tags: (r.tags as string[]) ?? [],
            source: r.source as string,
            image_url: (r.image_url as string) ?? "",
            description: r.description as string | null ?? null,
            starts_at: r.starts_at as string | null ?? null,
            ends_at: r.ends_at as string | null ?? null,
            source_url: r.source_url as string | null ?? null,
          }));
        setListings(mapped);
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const hasMaxPrice = filters.maxPrice < 200;
      if (hasMaxPrice && l.price_min === null) return false;
      if (l.price_min !== null && l.price_min > filters.maxPrice) return false;
      if (filters.showFood && l.type === "food" && !isSGCP(l)) return true;
      if (filters.showEvents && l.type === "event" && !isSGCP(l)) return true;
      if ((filters.showSGCP || filters.showEvents) && isSGCP(l)) return true;
      return false;
    });
  }, [listings, filters]);

  const displayListings: Listing[] = meetupResult
    ? meetupResult.results
    : filteredListings;

  const handleAddressesChange = useCallback((next: string[]) => {
    setAddresses(next);
    if (next.length < 2) setMeetupResult(null);
  }, []);

  const handleFindMeetup = useCallback(async () => {
    setIsMeetupLoading(true);
    setMeetupError(null);
    setMeetupResult(null);
    try {
      const res = await fetch(`${API_BASE}/meetup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addresses,
          // Pass a type only when exactly one category is selected
          type: (filters.showFood && !filters.showEvents && !filters.showSGCP)
            ? "food"
            : (!filters.showFood && (filters.showEvents || filters.showSGCP))
            ? "event"
            : undefined,
          price_max: filters.maxPrice < 200 ? filters.maxPrice * 100 : undefined,
          radius_km: DISTANCE_TO_KM[filters.distance],
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? "Something went wrong");
      }
      const data: MeetupResponse = await res.json();
      // Meetup results come raw from the DB (prices in cents, possible nulls).
      // Apply the same normalization as the /listings fetch.
      const normalizedResults = data.results.map((r) => ({
        ...r,
        price_min: r.price_min != null ? Math.round(r.price_min / 100) : null,
        price_max: r.price_max != null ? Math.round(r.price_max / 100) : (r.price_min != null ? Math.round(r.price_min / 100) : null),
        tags: r.tags ?? [],
        image_url: r.image_url ?? "",
      }));
      setMeetupResult({ ...data, results: normalizedResults });
    } catch (err) {
      setMeetupError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsMeetupLoading(false);
    }
  }, [addresses, filters]);

  const handlePinClick = useCallback((listing: Listing) => {
    setSelectedListing((prev) => (prev?.id === listing.id ? null : listing));
  }, []);

  // Card clicked in panel — select to enlarge pin, no map movement
  const handlePanelSelect = useCallback((listing: Listing) => {
    setSelectedListing((prev) => (prev?.id === listing.id ? null : listing));
  }, []);

  const handleClose = useCallback(() => setSelectedListing(null), []);

  const isMeetupMode = meetupResult !== null;

  const closeOverlays = useCallback(() => {
    setMobileSidebarOpen(false);
    setMobilePanelOpen(false);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100dvh",
        background: "#f1f5f9",
        color: "#0f172a",
        overflow: "hidden",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Mobile backdrop */}
      {isMobile && (mobileSidebarOpen || mobilePanelOpen) && (
        <div
          onClick={closeOverlays}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 900,
          }}
        />
      )}

      <FilterSidebar
        filters={filters}
        onChange={setFilters}
        totalCount={listings.length}
        filteredCount={filteredListings.length}
        addresses={addresses}
        onAddressesChange={handleAddressesChange}
        onFindMeetup={handleFindMeetup}
        isMeetupLoading={isMeetupLoading}
        meetupError={meetupError}
        meetupResultCount={meetupResult?.results.length ?? null}
        isLoading={isLoading}
        loadError={loadError}
        isMobile={isMobile}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={closeOverlays}
      />
      <MapView
        listings={displayListings}
        selectedId={selectedListing?.id}
        onPinClick={handlePinClick}
        centroid={meetupResult?.centroid}
        friends={meetupResult?.friends}
        isMeetupMode={isMeetupMode}
      />
      <ListingsPanel
        listings={displayListings}
        selectedId={selectedListing?.id}
        onSelect={handlePanelSelect}
        isMeetupMode={isMeetupMode}
        isMobile={isMobile}
        mobileOpen={mobilePanelOpen}
        onMobileClose={closeOverlays}
      />
      <ListingDrawer listing={selectedListing} onClose={handleClose} isMobile={isMobile} />

      {/* Mobile bottom bar */}
      {isMobile && !selectedListing && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            zIndex: 1200,
          }}
        >
          <button
            onClick={() => { setMobileSidebarOpen((v) => !v); setMobilePanelOpen(false); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 16px",
              borderRadius: 24,
              border: mobileSidebarOpen ? "1.5px solid rgba(99,102,241,0.4)" : "1.5px solid rgba(0,0,0,0.1)",
              background: mobileSidebarOpen ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              color: mobileSidebarOpen ? "#6366f1" : "#475569",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            }}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
          <button
            onClick={() => { setMobilePanelOpen((v) => !v); setMobileSidebarOpen(false); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 16px",
              borderRadius: 24,
              border: mobilePanelOpen ? "1.5px solid rgba(99,102,241,0.4)" : "1.5px solid rgba(0,0,0,0.1)",
              background: mobilePanelOpen ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              color: mobilePanelOpen ? "#6366f1" : "#475569",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            }}
          >
            <List size={14} />
            Places ({displayListings.length})
          </button>
        </div>
      )}
    </div>
  );
}
