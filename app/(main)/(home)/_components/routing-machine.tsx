import { memo, useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from 'leaflet';
import { PositionType } from "./map";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

type RoutingMachineProps = {
  waypoints: PositionType[];
  myIcon: L.Icon<L.IconOptions>
  friendIcon: L.Icon<L.IconOptions>
  myMarkerText: string
  friendMarkerText: string
}

export const RoutingMachine = memo(({
  waypoints,
  myIcon,
  friendIcon,
  myMarkerText,
  friendMarkerText
}: RoutingMachineProps) => {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control>(null);

  useEffect(() => {
    if (!map || routingControlRef.current) return;

    const routingControl = (L as any).Routing.control({
      router: IS_PRODUCTION ? new (L as any).Routing.GraphHopper(process.env.NEXT_PUBLIC_GRAPH_HOPPER_API_KEY) : null,
      routeWhileDragging: false,
      showAlternatives: true,
      lineOptions: { styles: [{ color: 'blue' }] },
      addWaypoints: false,
      draggableWaypoints: false,
      collapsible: true,
      fitSelectedRoutes: false,
      createMarker: function (i: number, wp: any) {
        const marker = L.marker(wp.latLng);
        marker.setIcon(i === 0 ? myIcon : friendIcon);
        if (i === 0) marker.bindPopup(myMarkerText);
        else marker.bindPopup(friendMarkerText);
        return marker;
      }
    }).addTo(map);

    routingControlRef.current = routingControl;

    return () => {
      if (map && routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [map, myIcon, friendIcon, myMarkerText, friendMarkerText]);

  // Update waypoints dynamically without recreating the control
  useEffect(() => {
    if (routingControlRef.current && waypoints.length > 0) {
      routingControlRef.current.setWaypoints(
        waypoints.map(wp => L.latLng(wp.lat, wp.lng))
      );
    }
  }, [waypoints]);

  return null;
})
