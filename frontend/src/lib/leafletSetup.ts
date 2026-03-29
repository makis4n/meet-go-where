// Makes Leaflet available as window.L so UMD plugins (leaflet.markercluster)
// can find it at module evaluation time.
import L from "leaflet";
(window as unknown as Record<string, unknown>).L = L;
