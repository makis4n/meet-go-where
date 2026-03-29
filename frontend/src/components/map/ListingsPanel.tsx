import { MapPin, Clock, Navigation2, X } from "lucide-react";
import type { Listing } from "../../types/listing";
import { PIN_COLORS, getPinVariant } from "../../lib/mapUtils";

interface ListingsPanelProps {
  listings: Listing[];
  selectedId: string | undefined;
  onSelect: (listing: Listing) => void;
  isMeetupMode: boolean;
  isMobile?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function formatPrice(min: number | null, max: number | null, type: string): string {
  if (min === null && max === null) return "—";
  if (min === 0 && max === 0) return type === "food" ? "—" : "Free";
  if (min === max) return `$${min}`;
  return `$${min}–${max}`;
}

function bestCommuteTime(listing: Listing): { minutes: number; mode: string } | null {
  if (!listing.commutes) return null;
  for (const [mode, label] of [["pt", "transit"], ["drive", "drive"], ["walk", "walk"]] as const) {
    const t = listing.commutes[mode]?.max_time_min;
    if (t != null) return { minutes: t, mode: label };
  }
  return null;
}

function TypeDot({ listing }: { listing: Listing }) {
  return (
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: PIN_COLORS[getPinVariant(listing)].bg,
        flexShrink: 0,
        marginTop: 3,
      }}
    />
  );
}

export function ListingsPanel({
  listings,
  selectedId,
  onSelect,
  isMeetupMode,
  isMobile = false,
  mobileOpen = false,
  onMobileClose,
}: ListingsPanelProps) {
  return (
    <aside
      style={
        isMobile
          ? {
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(85vw, 320px)",
              background: "#ffffff",
              borderLeft: "1px solid rgba(0,0,0,0.07)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 950,
              transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)",
              boxShadow: mobileOpen ? "-4px 0 24px rgba(0,0,0,0.12)" : "none",
            }
          : {
              width: 272,
              flexShrink: 0,
              background: "#ffffff",
              borderLeft: "1px solid rgba(0,0,0,0.07)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }
      }
    >
      {/* Header */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid rgba(0,0,0,0.06)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Navigation2 size={14} style={{ color: isMeetupMode ? "#6366f1" : "#94a3b8" }} />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: isMeetupMode ? "#6366f1" : "#94a3b8",
              }}
            >
              {isMeetupMode ? "Meetup Spots" : "Listings"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {isMeetupMode && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 7px",
                  borderRadius: 20,
                  background: "rgba(99,102,241,0.1)",
                  color: "#6366f1",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                Sorted by commute
              </span>
            )}
            {isMobile && (
              <button
                onClick={onMobileClose}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 4 }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 5 }}>
          {listings.length} {listings.length === 1 ? "place" : "places"}
        </p>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {listings.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 10,
              padding: 24,
            }}
          >
            <MapPin size={24} style={{ color: "#e2e8f0" }} />
            <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", lineHeight: 1.5 }}>
              {isMeetupMode
                ? "No venues near the midpoint — try a larger radius"
                : "No listings match your filters"}
            </p>
          </div>
        ) : (
          listings.map((listing) => {
            const isSelected = listing.id === selectedId;
            const commute = bestCommuteTime(listing);
            const isFree = listing.type !== "food" && listing.price_min === 0 && listing.price_max === 0 && listing.price_min !== null;

            return (
              <button
                key={listing.id}
                onClick={() => onSelect(listing)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                  background: isSelected ? "#f5f5ff" : "transparent",
                  border: "none",
                  borderLeft: isSelected ? "3px solid #6366f1" : "3px solid transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.1s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "#fafafa";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <TypeDot listing={listing} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: isSelected ? "#4f46e5" : "#0f172a",
                      marginBottom: 3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {listing.name}
                  </p>

                  {listing.tags.length > 0 && (
                    <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: commute ? 4 : 0 }}>
                      {listing.tags.slice(0, 2).join(" · ")}
                    </p>
                  )}

                  {commute && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={10} style={{ color: "#6366f1", flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: "#6366f1", fontWeight: 500 }}>
                        ≈ {commute.minutes} min · {commute.mode}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: "monospace",
                      fontWeight: 600,
                      color: isFree ? "#16a34a" : "#334155",
                    }}
                  >
                    {formatPrice(listing.price_min, listing.price_max, listing.type)}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
