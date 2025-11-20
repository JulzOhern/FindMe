import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from 'leaflet';
import { PositionType } from "./map";

type RoutingMachineProps = {
  waypoints: PositionType[];
  myIcon: L.Icon<L.IconOptions>
  friendIcon: L.Icon<L.IconOptions>
}

export function RoutingMachine({ waypoints, myIcon, friendIcon }: RoutingMachineProps) {
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
        fitSelectedRoutes: false,
        createMarker: function (i: number, wp: any) {
          const marker = L.marker(wp.latLng);
          marker.setIcon(i === 0 ? myIcon : friendIcon);
          if (i === 0) marker.bindPopup("<b>You are here!</b>");
          else marker.bindPopup("<b>Your friend is here!</b>");
          return marker;
        }
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
