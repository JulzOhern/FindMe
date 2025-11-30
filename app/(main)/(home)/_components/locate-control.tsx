import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { LocateControl as LocateControlBtn } from "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css"

export function LocateControl() {
  const map = useMap();

  useEffect(() => {
    const lc = new LocateControlBtn({
      position: "bottomleft",
      flyTo: true,
      initialZoomLevel: 15,
      drawCircle: false,
      drawMarker: false
    }).addTo(map);

    return () => {
      map.removeControl(lc);
    }
  }, []);

  return null
}
