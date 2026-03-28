import { useState, useRef, type KeyboardEvent } from "react";
import { SlidersHorizontal, Plus, X, Users, Loader2 } from "lucide-react";
import type { Filters, DistanceOption } from "../../types/listing";
import { PIN_COLORS, type PinVariant } from "../../lib/mapUtils";
import { FilterSection } from "./FilterSection";

interface FilterSidebarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  totalCount: number;
  filteredCount: number;
  addresses: string[];
  onAddressesChange: (addresses: string[]) => void;
  onFindMeetup: () => void;
  isMeetupLoading: boolean;
  meetupError: string | null;
  meetupResultCount: number | null;
  isLoading?: boolean;
  loadError?: string | null;
}

const TYPE_OPTIONS: { key: "showFood" | "showEvents" | "showSGCP"; label: string; color: string }[] = [
  { key: "showFood",   label: "Food & Drink",      color: "#f97316" },
  { key: "showEvents", label: "Events",             color: "#0ea5e9" },
  { key: "showSGCP",   label: "SG Culture Pass",    color: "#7c3aed" },
];

const DISTANCE_OPTIONS: DistanceOption[] = ["500m", "1km", "2km", "5km"];

export function FilterSidebar({
  filters,
  onChange,
  totalCount,
  filteredCount,
  addresses,
  onAddressesChange,
  onFindMeetup,
  isMeetupLoading,
  meetupError,
  meetupResultCount,
  isLoading = false,
  loadError = null,
}: FilterSidebarProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addAddress = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || addresses.includes(trimmed)) return;
    onAddressesChange([...addresses, trimmed]);
    setInputValue("");
    inputRef.current?.focus();
  };

  const removeAddress = (index: number) => {
    onAddressesChange(addresses.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addAddress();
  };

  const canFindMeetup = addresses.length >= 2;

  return (
    <aside
      style={{
        width: 260,
        flexShrink: 0,
        background: "#ffffff",
        borderRight: "1px solid rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "18px 20px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <SlidersHorizontal size={14} style={{ color: "#6366f1" }} />
          <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em", color: "#6366f1", textTransform: "uppercase" }}>
            Filters
          </span>
        </div>
        <p style={{ fontSize: 12, color: loadError ? "#ef4444" : "#94a3b8", marginTop: 4 }}>
          {loadError
            ? "Failed to load listings"
            : isLoading
            ? "Loading…"
            : meetupResultCount !== null
            ? `${meetupResultCount} meetup spots found`
            : `${filteredCount} of ${totalCount} listings`}
        </p>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

        {/* People / Addresses */}
        <FilterSection label="People">
          {/* Address list */}
          {addresses.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 8 }}>
              {addresses.map((addr, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 8px 6px 10px",
                    borderRadius: 8,
                    background: "#f8fafc",
                    border: "1px solid rgba(0,0,0,0.07)",
                  }}
                >
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Users size={10} style={{ color: "#64748b" }} />
                  </div>
                  <span style={{ flex: 1, fontSize: 12, color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {addr}
                  </span>
                  <button
                    onClick={() => removeAddress(i)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#94a3b8", display: "flex", flexShrink: 0 }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input row */}
          <div style={{ display: "flex", gap: 5 }}>
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a postal code…"
              style={{
                flex: 1,
                padding: "7px 10px",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.09)",
                fontSize: 12,
                color: "#1e293b",
                background: "#fafafa",
                outline: "none",
                minWidth: 0,
              }}
            />
            <button
              onClick={addAddress}
              disabled={!inputValue.trim()}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                border: "none",
                background: inputValue.trim() ? "#6366f1" : "#e2e8f0",
                color: inputValue.trim() ? "#fff" : "#94a3b8",
                cursor: inputValue.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.15s ease",
              }}
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Find Meetup button */}
          <button
            onClick={onFindMeetup}
            disabled={!canFindMeetup || isMeetupLoading}
            style={{
              marginTop: 8,
              width: "100%",
              padding: "9px 0",
              borderRadius: 9,
              border: "none",
              cursor: canFindMeetup && !isMeetupLoading ? "pointer" : "default",
              fontSize: 12,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "all 0.15s ease",
              background: canFindMeetup ? "#6366f1" : "#f1f5f9",
              color: canFindMeetup ? "#fff" : "#94a3b8",
              boxShadow: canFindMeetup ? "0 2px 8px rgba(99,102,241,0.25)" : "none",
              opacity: isMeetupLoading ? 0.7 : 1,
            }}
          >
            {isMeetupLoading ? (
              <>
                <Loader2 size={13} style={{ animation: "spin 0.8s linear infinite" }} />
                Finding…
              </>
            ) : (
              <>
                <Users size={13} />
                {canFindMeetup ? "Find Meetup" : "Add 2 or more people"}
              </>
            )}
          </button>

          {/* Radius */}
          <div style={{ marginTop: 10 }}>
            <p style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Radius</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
              {DISTANCE_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => onChange({ ...filters, distance: d })}
                  style={{
                    padding: "6px 0",
                    borderRadius: 7,
                    border: filters.distance === d ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(0,0,0,0.08)",
                    cursor: "pointer",
                    fontSize: 11,
                    fontFamily: "monospace",
                    fontWeight: 500,
                    transition: "all 0.15s ease",
                    background: filters.distance === d ? "rgba(99,102,241,0.07)" : "#fafafa",
                    color: filters.distance === d ? "#6366f1" : "#94a3b8",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {meetupError && (
            <p style={{ marginTop: 8, fontSize: 11, color: "#ef4444", lineHeight: 1.4 }}>
              {meetupError}
            </p>
          )}
        </FilterSection>

        {/* Type checkboxes */}
        <FilterSection label="Sort by">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TYPE_OPTIONS.map(({ key, label, color }) => {
              const checked = filters[key];
              return (
                <label
                  key={key}
                  style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", userSelect: "none" }}
                >
                  <div
                    onClick={() => onChange({ ...filters, [key]: !checked })}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      border: checked ? `2px solid ${color}` : "2px solid #d1d5db",
                      background: checked ? color : "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.15s ease",
                    }}
                  >
                    {checked && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.2 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: 13, color: checked ? "#1e293b" : "#64748b", transition: "color 0.15s" }}>
                    {label}
                  </span>
                </label>
              );
            })}
          </div>
        </FilterSection>

        {/* Price range */}
        <FilterSection label="Max Price" noBorder>
          <div style={{ paddingTop: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: "#cbd5e1" }}>$0</span>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: "#1e293b", fontWeight: 600 }}>
                {filters.maxPrice === 200 ? "No limit" : `$${filters.maxPrice}`}
              </span>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: "#cbd5e1" }}>$200</span>
            </div>
            <input
              type="range"
              min={0}
              max={200}
              step={5}
              value={filters.maxPrice}
              onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
              style={{
                width: "100%",
                appearance: "none",
                height: 4,
                borderRadius: 2,
                outline: "none",
                cursor: "pointer",
                background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(filters.maxPrice / 200) * 100}%, #e2e8f0 ${(filters.maxPrice / 200) * 100}%, #e2e8f0 100%)`,
              }}
            />
          </div>
        </FilterSection>

      </div>

      {/* Legend */}
      <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ fontFamily: "monospace", fontSize: 10, color: "#cbd5e1", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
          Legend
        </p>
        {([["food", "Food & Drink"], ["event", "Events"], ["sgculturepass", "SG Culture Pass"]] as [PinVariant, string][]).map(([variant, label]) => (
          <div key={variant} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: PIN_COLORS[variant].bg, boxShadow: `0 0 0 2px rgba(255,255,255,0.9), 0 0 0 3px ${PIN_COLORS[variant].bg}40` }} />
            <span style={{ fontSize: 12, color: "#64748b" }}>{label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </aside>
  );
}
