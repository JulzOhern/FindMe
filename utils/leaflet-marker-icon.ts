import L from 'leaflet';

export function leafletMarkerIcon(image: string | null | undefined) {
  return L.icon({
    iconUrl: image as unknown as string,
    iconSize: [41, 41],
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -40],
    className: "rounded-full"
  });
}