import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from 'leaflet';
import { PositionType } from "./map";

export function RoutingMachine({ waypoints }: { waypoints: PositionType[] }) {
  const map = useMap();
  const routingRef = useRef<any>(null);

  useEffect(() => {
    if (!map) return;

    if (!routingRef.current) {
      // Create only once
      routingRef.current = (L as any).Routing.control({
        waypoints: waypoints.map(wp => L.latLng(wp.lat, wp.lng)),
        routeWhileDragging: true,
        showAlternatives: true,
        /* lineOptions: { styles: [{ color: 'blue' }] }, */
        addWaypoints: false, // Prevent adding waypoints by clicking
        draggableWaypoints: false, // Prevent dragging waypoints
        collapsible: true,
      }).addTo(map);
    } else {
      // Update only the waypoints
      routingRef.current.setWaypoints(
        waypoints.map(wp => L.latLng(wp.lat, wp.lng))
      );
    }
  }, [map, waypoints]);

  return null;
}
