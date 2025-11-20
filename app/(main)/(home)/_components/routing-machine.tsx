import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from 'leaflet';
import { PositionType } from "./map";

type RoutingMachineProps = {
  waypoints: PositionType[];
  myIcon: L.Icon<L.IconOptions>
  friendIcon: L.Icon<L.IconOptions>
  myMarkerText: string
  friendMarkerText: string
}

export function RoutingMachine({
  waypoints,
  myIcon,
  friendIcon,
  myMarkerText,
  friendMarkerText
}: RoutingMachineProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = (L as any).Routing.control({
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
        if (i === 0) marker.bindPopup(myMarkerText);
        else marker.bindPopup(friendMarkerText);
        return marker;
      }
    }).addTo(map);

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    }
  }, [map, waypoints]);

  return null;
}
