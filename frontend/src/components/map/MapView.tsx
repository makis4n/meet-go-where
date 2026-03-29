import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, ZoomControl, useMap } from "react-leaflet";
import { MapPin } from "lucide-react";
import type { Listing, GeocodedFriend } from "../../types/listing";
import { MAP_CENTER, MAP_ZOOM, SINGAPORE_BOUNDS, PIN_COLORS, getPinVariant } from "../../lib/mapUtils";

function FlyToCentroid({ centroid }: { centroid?: { lat: number; lng: number } }) {
  const map = useMap();
  const prev = useRef<{ lat: number; lng: number } | undefined>(undefined);

  useEffect(() => {
    if (centroid) {
      map.flyTo([centroid.lat, centroid.lng], 14, { duration: 1.2 });
    } else if (prev.current) {
      map.flyTo([MAP_CENTER.lat, MAP_CENTER.lng], MAP_ZOOM, { duration: 1.2 });
    }
    prev.current = centroid;
  }, [centroid, map]);

  return null;
}


interface MapViewProps {
  listings: Listing[];
  selectedId: string | undefined;
  onPinClick: (listing: Listing) => void;
  centroid?: { lat: number; lng: number };
  friends?: GeocodedFriend[];
  isMeetupMode?: boolean;
}

const centroidIcon = L.divIcon({
  html: `<div style="width:32px;height:32px;border-radius:50%;background:#6366f1;border:3px solid #fff;box-shadow:0 2px 10px rgba(99,102,241,0.45);display:flex;align-items:center;justify-content:center;">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
      <circle cx="12" cy="12" r="3" fill="white" stroke="none"/>
      <line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="22" y2="12"/>
    </svg>
  </div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const friendIcon = L.divIcon({
  html: `<div style="width:22px;height:22px;border-radius:50%;background:#64748b;border:2px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  </div>`,
  className: "",
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function createPinIcon(listing: Listing, isSelected: boolean) {
  const variant = getPinVariant(listing);
  const colors = PIN_COLORS[variant];
  const size = isSelected ? 32 : 26;

  const foodSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>`;
  const eventSvg = `<svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>`;
  const cultureSvg = `<svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2z"/></svg>`;

  const pulseHtml = isSelected
    ? `<span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-60%);width:36px;height:36px;border-radius:50%;background:${colors.ring};animation:mapPinPulse 1.5s ease-out infinite;"></span>`
    : "";

  const icon = variant === "food" ? foodSvg : variant === "sgculturepass" ? cultureSvg : eventSvg;

  const html = `
    <div style="position:relative;display:flex;align-items:center;justify-content:center;">
      ${pulseHtml}
      <div style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${colors.bg};box-shadow:0 2px 8px ${colors.glow},0 0 0 ${isSelected ? 3 : 2}px rgba(255,255,255,${isSelected ? 0.9 : 0.7});">
        <span style="transform:rotate(45deg);display:flex;align-items:center;justify-content:center;">
          ${icon}
        </span>
      </div>
    </div>`;

  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

const VARIANT_COLOR: Record<string, string> = {
  food: "#f97316",
  event: "#0ea5e9",
  sgculturepass: "#7c3aed",
};

const VARIANTS = ["food", "event", "sgculturepass"] as const;
type Variant = typeof VARIANTS[number];

function makeClusterGroup(variant: Variant): L.MarkerClusterGroup {
  const color = VARIANT_COLOR[variant];
  return L.markerClusterGroup({
    maxClusterRadius: 60,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    disableClusteringAtZoom: 15,
    iconCreateFunction: (c) => {
      const count = c.getChildCount();
      const size = count < 10 ? 34 : count < 50 ? 40 : 46;
      const fontSize = size < 40 ? 12 : 11;
      return L.divIcon({
        html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,0.18);display:flex;align-items:center;justify-content:center;font-size:${fontSize}px;font-weight:700;color:#fff;font-family:ui-sans-serif,system-ui,sans-serif;text-shadow:0 1px 2px rgba(0,0,0,0.3);">${count}</div>`,
        className: "",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    },
  });
}

function ClusterLayer({
  listings,
  selectedId,
  onPinClick,
}: {
  listings: Listing[];
  selectedId: string | undefined;
  onPinClick: (listing: Listing) => void;
}) {
  const map = useMap();
  const groupsRef = useRef<Record<Variant, L.MarkerClusterGroup> | null>(null);

  useEffect(() => {
    const groups = {
      food: makeClusterGroup("food"),
      event: makeClusterGroup("event"),
      sgculturepass: makeClusterGroup("sgculturepass"),
    };
    groupsRef.current = groups;
    VARIANTS.forEach((v) => map.addLayer(groups[v]));
    return () => { VARIANTS.forEach((v) => map.removeLayer(groups[v])); };
  }, [map]);

  useEffect(() => {
    const groups = groupsRef.current;
    if (!groups) return;
    VARIANTS.forEach((v) => groups[v].clearLayers());
    listings.forEach((listing) => {
      const variant = getPinVariant(listing);
      const marker = L.marker([listing.lat, listing.lng], {
        icon: createPinIcon(listing, listing.id === selectedId),
      });
      marker.on("click", () => onPinClick(listing));
      groups[variant].addLayer(marker);
    });
  }, [listings, selectedId, onPinClick]);

  return null;
}

export function MapView({ listings, selectedId, onPinClick, centroid, friends, isMeetupMode }: MapViewProps) {
  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      <MapContainer
        center={[MAP_CENTER.lat, MAP_CENTER.lng]}
        zoom={MAP_ZOOM}
        minZoom={MAP_ZOOM}
        maxZoom={18}
        maxBounds={L.latLngBounds(SINGAPORE_BOUNDS.sw, SINGAPORE_BOUNDS.ne)}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        {/* Base map — no labels, no detail increase on zoom */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={20}
          updateWhenZooming={false}
          keepBuffer={2}
        />
        {/* Label overlay frozen at zoom 12 — only neighbourhood-level names, scales up when zooming in */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
          maxZoom={20}
          maxNativeZoom={12}
          updateWhenZooming={false}
          opacity={0.8}
          pane="shadowPane"
        />

        {isMeetupMode ? (
          listings.map((listing) => (
            <Marker
              key={`${listing.id}-${listing.id === selectedId}`}
              position={[listing.lat, listing.lng]}
              icon={createPinIcon(listing, listing.id === selectedId)}
              eventHandlers={{ click: () => onPinClick(listing) }}
            />
          ))
        ) : (
          <ClusterLayer listings={listings} selectedId={selectedId} onPinClick={onPinClick} />
        )}

        {/* Friend location markers */}
        {friends?.map((f, i) => (
          <Marker key={`friend-${i}`} position={[f.lat, f.lng]} icon={friendIcon} />
        ))}

        {/* Midpoint marker */}
        {centroid && (
          <Marker position={[centroid.lat, centroid.lng]} icon={centroidIcon} />
        )}

        <FlyToCentroid centroid={centroid} />
        <ZoomControl position="bottomright" />
      </MapContainer>

      {listings.length === 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(248,250,252,0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 500,
            pointerEvents: "none",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <MapPin size={28} style={{ color: "#cbd5e1", margin: "0 auto 10px" }} />
            <p style={{ color: "#94a3b8", fontSize: 14 }}>
              {isMeetupMode
                ? "No venues found near the midpoint — try a larger radius"
                : "No listings match your filters"}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes mapPinPulse {
          0%   { transform: translate(-50%, -60%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -60%) scale(2);   opacity: 0; }
        }
        .leaflet-control-attribution {
          background: rgba(255,255,255,0.85) !important;
          color: #94a3b8 !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a { color: #94a3b8 !important; }
        .leaflet-control-zoom a {
          background: #ffffff !important;
          color: #475569 !important;
          border-color: rgba(0,0,0,0.1) !important;
          font-weight: 400 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f8fafc !important;
          color: #1e293b !important;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
          border: 2px solid #fff;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: 2px solid #fff;
        }
      `}</style>
    </div>
  );
}
