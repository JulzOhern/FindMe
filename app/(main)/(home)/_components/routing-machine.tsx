import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from 'leaflet';
import { DefaultIcon, PositionType } from "./map";

type RoutingMachineProps = {
  waypoints: PositionType[];
  myIcon: L.Icon<L.IconOptions>
}

export function RoutingMachine({ waypoints, myIcon }: RoutingMachineProps) {
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
        createMarker: function (i: number, wp: any, n: number) {
          const marker = L.marker(wp.latLng, {
            icon: i === 0 ? myIcon : DefaultIcon // first marker = my position, second = friend
          });

          if (i === 0) marker.bindPopup("<b>You are here!</b>");

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
