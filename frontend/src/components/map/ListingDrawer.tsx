import { useState, useEffect } from "react";
import { X, DollarSign, Tag, Navigation2, ExternalLink, ImageOff, CalendarDays } from "lucide-react";
import type { Listing } from "../../types/listing";
import { SOURCE_COLORS, PIN_COLORS, getPinVariant } from "../../lib/mapUtils";

function formatDateRange(starts_at: string | null | undefined, ends_at: string | null | undefined): string | null {
  if (!starts_at) return null;
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });
  const start = fmt(starts_at);
  if (!ends_at) return start;
  const end = fmt(ends_at);
  return start === end ? start : `${start} – ${end}`;
}

interface ListingDrawerProps {
  listing: Listing | null;
  onClose: () => void;
  isMobile?: boolean;
}

function formatPrice(min: number | null, max: number | null, type: string): string {
  if (min === null && max === null) return "—";
  if (min === 0 && max === 0) return type === "food" ? "—" : "Free";
  if (min === max) return `$${min}`;
  return `$${min} – $${max}`;
}

export function ListingDrawer({ listing, onClose, isMobile = false }: ListingDrawerProps) {
  const [imgFailed, setImgFailed] = useState(false);

  // Reset image state whenever a new listing is selected
  useEffect(() => { setImgFailed(false); }, [listing?.id]);

  const isOpen = listing !== null;
  const isFree = listing?.type !== "food" && listing?.price_min === 0 && listing?.price_max === 0 && listing?.price_min !== null;
  const priceLabel = listing ? formatPrice(listing.price_min, listing.price_max, listing.type) : "";
  const dateLabel = listing ? formatDateRange(listing.starts_at, listing.ends_at) : null;
  const sourceColor = listing ? (SOURCE_COLORS[listing.source] ?? "#94a3b8") : "#94a3b8";
  const pinColor = listing ? PIN_COLORS[getPinVariant(listing)].bg : "#94a3b8";

  return (
    <>
      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: isMobile ? "100%" : 380,
          background: "#ffffff",
          borderLeft: "1px solid rgba(0,0,0,0.07)",
          zIndex: 1100,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
          boxShadow: "-16px 0 48px rgba(0,0,0,0.08)",
        }}
      >
        {listing && (
          <>
            {/* Hero image */}
            <div style={{ position: "relative", height: 200, flexShrink: 0, overflow: "hidden", background: "#f1f5f9" }}>
              {listing.image_url && !imgFailed ? (
                <img
                  src={listing.image_url}
                  alt={listing.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: `linear-gradient(135deg, ${pinColor}18 0%, #f1f5f9 100%)`,
                }}>
                  <ImageOff size={28} style={{ color: `${pinColor}60` }} />
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>No image available</span>
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "50%",
                  background: "linear-gradient(to top, rgba(255,255,255,1) 0%, transparent 100%)",
                }}
              />

              {/* Type chip */}
              <span
                style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(8px)",
                  color: listing.type === "food" ? "#ea580c" : "#0284c7",
                  border: `1px solid ${listing.type === "food" ? "rgba(249,115,22,0.2)" : "rgba(14,165,233,0.2)"}`,
                }}
              >
                {listing.type}
              </span>

              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "1px solid rgba(0,0,0,0.1)",
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(8px)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748b",
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 20px" }}>
              {/* Name & source */}
              <div style={{ marginBottom: 14 }}>
                <h2
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#0f172a",
                    lineHeight: 1.3,
                    marginBottom: 8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {listing.name}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      padding: "2px 7px",
                      borderRadius: 4,
                      fontSize: 10,
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      background: `${sourceColor}15`,
                      color: sourceColor,
                      border: `1px solid ${sourceColor}30`,
                      textTransform: "uppercase",
                    }}
                  >
                    {listing.source}
                  </span>
                </div>
              </div>

              <div style={{ height: 1, background: "rgba(0,0,0,0.06)", marginBottom: 14 }} />

              {/* Price */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: isFree ? "rgba(22,163,74,0.08)" : "#f8fafc",
                    border: isFree ? "1px solid rgba(22,163,74,0.2)" : "1px solid rgba(0,0,0,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <DollarSign size={15} style={{ color: isFree ? "#16a34a" : "#94a3b8" }} />
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace", marginBottom: 2 }}>PRICE</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: isFree ? "#16a34a" : "#0f172a", fontFamily: "monospace" }}>
                    {priceLabel}
                  </p>
                </div>
              </div>

              {/* Date */}
              {dateLabel && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f8fafc", border: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <CalendarDays size={15} style={{ color: "#94a3b8" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace", marginBottom: 2 }}>DATE</p>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{dateLabel}</p>
                  </div>
                </div>
              )}

              {/* Description */}
              {listing.description && (
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 16 }}>
                  {listing.description}
                </p>
              )}

              {/* Tags */}
              {listing.tags.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Tag size={11} style={{ color: "#94a3b8" }} />
                  <p style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace" }}>TAGS</p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {listing.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        background: "#f1f5f9",
                        color: "#475569",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              )}
            </div>

            {/* CTA */}
            <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", gap: 8 }}>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${listing.lat},${listing.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  padding: "11px 0",
                  borderRadius: 10,
                  background: listing.source_url ? "#f8fafc" : "#6366f1",
                  color: listing.source_url ? "#475569" : "#fff",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  border: listing.source_url ? "1px solid rgba(0,0,0,0.09)" : "none",
                  boxShadow: listing.source_url ? "none" : "0 2px 8px rgba(99,102,241,0.3)",
                }}
              >
                <Navigation2 size={14} />
                Directions
              </a>
              {listing.source_url && (
                <a
                  href={listing.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    padding: "11px 0",
                    borderRadius: 10,
                    background: pinColor,
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                    boxShadow: `0 2px 8px ${pinColor}4d`,
                  }}
                >
                  <ExternalLink size={14} />
                  View on Site
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
