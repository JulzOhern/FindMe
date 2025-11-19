import L from 'leaflet';
import { MapContainer, ZoomControl } from 'react-leaflet'
import 'leaflet-routing-machine';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { LayersControlSection } from './layers-control-section';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RoutingMachine } from './routing-machine';

const DefaultIcon = L.icon({
  iconUrl: icon as unknown as string,
  shadowUrl: iconShadow as unknown as string,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export type PositionType = { lat: number, lng: number }

export default function Map() {
  const [position, setPosition] = useState<PositionType | null>(null);
  const [friendPosition, setFriendPosition] = useState({ lat: 14.0032, lng: 121.1073 });

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setPosition({ lat: latitude, lng: longitude })
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  if (!position) return null

  return (
    <>
      <MapContainer
        style={{ minHeight: '100vh' }}
        center={[position.lat, position.lng]}
        zoom={13}
        zoomControl={false}
        scrollWheelZoom={true}
        fadeAnimation
      >
        {/* <Marker position={[position.lat, position.lng]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}

        <RoutingMachine waypoints={[position, friendPosition]} />

        <ZoomControl position='bottomleft' />
        <LayersControlSection />
      </MapContainer>
    </>
  )
}